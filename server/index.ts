
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import prisma from './services/db';
import dotenv from 'dotenv';

import { executeFlow } from './executor';
import { runPortScan } from './services/nmap';
import { runNuclei } from './services/nuclei';
import { runGobuster } from './services/gobuster';
import { runWhatWeb } from './services/whatweb';
import { runSubfinder } from './services/subfinder';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for dev
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// API Routes
app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0' });
});

// Flow APIs
app.post('/api/flows', async (req, res) => {
    try {
        const { name, nodes, edges } = req.body;
        const flow = await prisma.flow.create({
            data: {
                name,
                nodes,
                edges
            }
        });
        res.json(flow);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/flows', async (req, res) => {
    try {
        const flows = await prisma.flow.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        res.json(flows);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/flows/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const flow = await prisma.flow.findUnique({
            where: { id }
        });
        if (!flow) return res.status(404).json({ error: 'Flow not found' });
        res.json(flow);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/run-flow', async (req, res) => {
    const { nodes, edges, flowId } = req.body;
    const executionId = uuidv4();

    // Create Execution Record
    try {
        if (flowId) {
            await prisma.execution.create({
                data: {
                    id: executionId,
                    flowId: flowId,
                    status: 'running',
                    logs: []
                }
            });
        }
    } catch (e) {
        console.error("Failed to create execution record:", e);
    }

    // Start execution asynchronously
    executeFlow(executionId, nodes, edges, io, flowId).catch(err => {
        console.error('Execution failed:', err);
        io.emit('error', { executionId, message: err.message });
    });

    res.json({ executionId, status: 'started' });
});

app.post('/api/run-tool', async (req, res) => {
    const { tool, target } = req.body;

    if (tool === 'nmap') {
        console.log(`[API] Received Nmap request for ${target}`);

        // Emit start event
        io.emit('terminal-log', { message: `Starting Nmap scan on ${target}...` });

        try {
            // Run the scan
            // Note: We are reusing the service but we need to handle the promise here or fire-and-forget
            // For terminal, we want to stream logs. The current service returns a promise with full result.
            // We might want to refactor service to stream, but for now we'll wait and emit the result.

            // Fire and forget to avoid blocking HTTP response, but we need to handle errors
            runPortScan(target)
                .then(result => {
                    io.emit('terminal-log', { message: `Scan Complete.Found ${result.ports.length} open ports.` });
                    io.emit('terminal-log', { message: `Open Ports: ${result.ports.map((p: any) => p.port).join(', ')} ` });
                    io.emit('terminal-log', { message: `Raw Output: \n${result.raw} ` });
                    io.emit('tool-finished', {});
                })
                .catch(err => {
                    io.emit('terminal-log', { message: `Error: ${err.message} ` });
                    io.emit('tool-finished', {});
                });

            res.json({ status: 'started', tool, target });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(400).json({ error: 'Unknown tool' });
    }
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('terminal-command', async (cmd: string) => {
        console.log(`Received command: ${cmd}`);
        socket.emit('terminal-output', { type: 'command', content: `> ${cmd}` });

        const parts = cmd.trim().split(' ');
        const command = parts[0];
        const target = parts[1];

        try {
            if (command === '/scan') {
                if (!target) {
                    socket.emit('terminal-output', { type: 'error', content: 'Usage: /scan <target>' });
                    return;
                }

                // 1. Nmap
                socket.emit('terminal-output', { type: 'info', content: `[Nmap] Scanning ${target}...` });
                const nmapRes = await runPortScan(target);
                socket.emit('terminal-output', { type: 'success', content: `[Nmap] Found ${nmapRes.ports.length} open ports.` });
                if (nmapRes.osGuess !== 'Unknown') {
                    socket.emit('terminal-output', { type: 'info', content: `[Nmap] OS: ${nmapRes.osGuess}` });
                    socket.emit('finding', { type: 'os', data: nmapRes.osGuess });
                }
                nmapRes.ports.forEach((p: any) => {
                    socket.emit('finding', { type: 'port', data: p });
                });

                // 2. Subfinder
                socket.emit('terminal-output', { type: 'info', content: `[Subfinder] Enumerating subdomains for ${target}...` });
                const subfinderRes = await runSubfinder(target);
                socket.emit('terminal-output', { type: 'success', content: `[Subfinder] Found ${subfinderRes.length} subdomains.` });
                subfinderRes.slice(0, 3).forEach(s => {
                    socket.emit('terminal-output', { type: 'data', content: `${s.host} (${s.ip})` });
                });
                if (subfinderRes.length > 3) {
                    socket.emit('terminal-output', { type: 'data', content: `...and ${subfinderRes.length - 3} more.` });
                }
                subfinderRes.forEach(s => {
                    socket.emit('finding', { type: 'subdomain', data: s });
                });

                // 3. WhatWeb (Tech Stack)
                socket.emit('terminal-output', { type: 'info', content: `[WhatWeb] Identifying technologies on ${target}...` });
                const whatwebRes = await runWhatWeb(target);
                const techList = Object.entries(whatwebRes.plugins).map(([name, info]) => {
                    const version = info.version ? `v${info.version[0]}` : '';
                    return `${name} ${version}`;
                }).join(', ');
                socket.emit('terminal-output', { type: 'success', content: `[WhatWeb] Detected: ${techList}` });
                Object.entries(whatwebRes.plugins).forEach(([name, info]) => {
                    socket.emit('finding', { type: 'tech', data: { name, info } });
                });

                // 4. Nuclei
                socket.emit('terminal-output', { type: 'info', content: `[Nuclei] Scanning ${target}...` });
                const nucleiRes = await runNuclei(target);
                nucleiRes.findings.forEach((f: any) => {
                    socket.emit('terminal-output', { type: 'result', content: `[${f.info.severity.toUpperCase()}] ${f.info.name}`, severity: f.info.severity });
                    socket.emit('finding', { type: 'vuln', data: f });
                });

                // 5. Gobuster
                socket.emit('terminal-output', { type: 'info', content: `[Gobuster] Bruteforcing directories on ${target}...` });
                const gobusterRes = await runGobuster(target);
                gobusterRes.paths.forEach((p) => {
                    let severity = 'info';
                    if (p.status === 200) severity = 'success';
                    if (p.path.includes('.env') || p.path.includes('config')) severity = 'critical';

                    socket.emit('terminal-output', {
                        type: 'result',
                        content: `[${p.status}] ${p.path} (Size: ${p.size})`,
                        severity
                    });
                    socket.emit('finding', { type: 'dir', data: { ...p, severity } });
                });

            } else if (command === '/nmap') {
                if (!target) {
                    socket.emit('terminal-output', { type: 'error', content: 'Usage: /nmap <target>' });
                    return;
                }
                socket.emit('terminal-output', { type: 'info', content: `Running Nmap on ${target}...` });
                const res = await runPortScan(target);
                socket.emit('terminal-output', { type: 'success', content: `Scan Complete. ${res.ports.length} ports open.` });
                res.ports.forEach((p: any) => {
                    socket.emit('terminal-output', { type: 'data', content: `${p.port}/${p.protocol} - ${p.service} (${p.version})` });
                    socket.emit('finding', { type: 'port', data: p });
                });

            } else if (command === '/nuclei') {
                if (!target) {
                    socket.emit('terminal-output', { type: 'error', content: 'Usage: /nuclei <target>' });
                    return;
                }
                socket.emit('terminal-output', { type: 'info', content: `Running Nuclei on ${target}...` });
                const res = await runNuclei(target);
                res.findings.forEach((f: any) => {
                    socket.emit('terminal-output', { type: 'result', content: `[${f.info.severity}] ${f.info.name} - ${f.matched_at}`, severity: f.info.severity });
                    socket.emit('finding', { type: 'vuln', data: f });
                });

            } else if (command === '/gobuster') {
                if (!target) {
                    socket.emit('terminal-output', { type: 'error', content: 'Usage: /gobuster <target>' });
                    return;
                }
                socket.emit('terminal-output', { type: 'info', content: `Running Gobuster on ${target}...` });
                const res = await runGobuster(target);
                socket.emit('terminal-output', { type: 'success', content: `Found ${res.paths.length} paths.` });
                res.paths.forEach((p) => {
                    let severity = 'info';
                    if (p.status === 200) severity = 'success';
                    if (p.path.includes('.env') || p.path.includes('config')) severity = 'critical';

                    socket.emit('terminal-output', {
                        type: 'result',
                        content: `[${p.status}] ${p.path} (Size: ${p.size})`,
                        severity
                    });
                    socket.emit('finding', { type: 'dir', data: { ...p, severity } });
                });

            } else if (command === '/whatweb') {
                if (!target) {
                    socket.emit('terminal-output', { type: 'error', content: 'Usage: /whatweb <target>' });
                    return;
                }
                socket.emit('terminal-output', { type: 'info', content: `Identifying technologies on ${target}...` });
                const res = await runWhatWeb(target);
                socket.emit('terminal-output', { type: 'success', content: `Target: ${res.target} (${res.http_status})` });

                Object.entries(res.plugins).forEach(([name, info]) => {
                    const version = info.version ? `v${info.version[0]}` : '';
                    const account = info.account ? `(Account: ${info.account[0]})` : '';
                    const string = info.string ? `[${info.string[0]}]` : '';

                    // Highlight interesting techs
                    let severity = 'info';
                    if (['WordPress', 'Drupal', 'Joomla'].includes(name)) severity = 'high';
                    if (['Apache', 'Nginx', 'PHP'].includes(name)) severity = 'medium';

                    socket.emit('terminal-output', {
                        type: 'data',
                        content: `${name} ${version} ${account} ${string}`,
                        severity
                    });
                    socket.emit('finding', { type: 'tech', data: { name, info } });
                });

            } else if (command === '/subfinder') {
                if (!target) {
                    socket.emit('terminal-output', { type: 'error', content: 'Usage: /subfinder <target>' });
                    return;
                }
                socket.emit('terminal-output', { type: 'info', content: `Enumerating subdomains for ${target}...` });
                const res = await runSubfinder(target);
                socket.emit('terminal-output', { type: 'success', content: `Found ${res.length} subdomains.` });
                res.forEach(s => {
                    socket.emit('terminal-output', { type: 'data', content: `${s.host} (${s.ip})` });
                    socket.emit('finding', { type: 'subdomain', data: s });
                });

            } else if (command === '/help') {
                socket.emit('terminal-output', { type: 'info', content: 'Available commands:' });
                socket.emit('terminal-output', { type: 'data', content: '  /scan <target>     - Run full reconnaissance' });
                socket.emit('terminal-output', { type: 'data', content: '  /nmap <target>     - Run port scan' });
                socket.emit('terminal-output', { type: 'data', content: '  /nuclei <target>   - Run vulnerability scan' });
                socket.emit('terminal-output', { type: 'data', content: '  /gobuster <target> - Run directory brute-force' });
                socket.emit('terminal-output', { type: 'data', content: '  /whatweb <target>  - Identify technology stack' });
                socket.emit('terminal-output', { type: 'data', content: '  /subfinder <target> - Enumerate subdomains' });
            } else {
                socket.emit('terminal-output', { type: 'error', content: `Unknown command: ${command}` });
            }
        } catch (error: any) {
            socket.emit('terminal-output', { type: 'error', content: `Error: ${error.message}` });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

