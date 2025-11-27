import { Server } from 'socket.io';
import { runPortScan } from './services/nmap';
import { simulatePhishing, simulatePayload, simulateC2 } from './services/redteam';

// Simple types (can be shared later)
type Node = { id: string; type: string; data: any;[key: string]: any };
type Edge = { source: string; target: string; sourceHandle?: string | null;[key: string]: any };

type ExecutionContext = {
    target?: string;
    [key: string]: any;
};

import prisma from './services/db';

export const executeFlow = async (executionId: string, nodes: Node[], edges: Edge[], io: Server, flowId?: string) => {
    const emit = (event: string, data: any) => {
        io.emit(event, { executionId, ...data });
    };

    const log = async (message: string) => {
        emit('log', { message });
        if (flowId) {
            // Append log to DB (Optimized: In real app, batch this)
            // For now, we just update status at the end to avoid heavy DB writes
        }
    };

    const executionContext: ExecutionContext = {};

    log('Execution started on server...');

    // Find start node
    const incomingEdges = new Set(edges.map(e => e.target));
    const startNode = nodes.find(n => !incomingEdges.has(n.id)) || nodes[0];

    if (!startNode) {
        emit('error', { message: 'No start node found.' });
        if (flowId) {
            await prisma.execution.update({
                where: { id: executionId },
                data: { status: 'failed', completedAt: new Date() }
            });
        }
        return;
    }

    let currentNode: Node | undefined = startNode;
    const visitedNodeIds: string[] = [];

    try {
        while (currentNode) {
            visitedNodeIds.push(currentNode.id);

            // Notify client: Node Active
            emit('node-start', { nodeId: currentNode.id });
            log(`Executing node: ${currentNode.data.label || currentNode.type}`);

            // Execution Logic based on Node Type
            if (currentNode.type === 'target') {
                emit('node-status', { nodeId: currentNode.id, status: 'running' });
                const target = currentNode.data.target;
                if (target) {
                    executionContext.target = target;
                    log(`Target set to: ${target}`);
                    emit('node-status', { nodeId: currentNode.id, status: 'success' });
                } else {
                    log('Warning: No target specified in Target node.');
                    emit('node-status', { nodeId: currentNode.id, status: 'failed' });
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            else if (currentNode.type === 'port-scan') {
                emit('node-status', { nodeId: currentNode.id, status: 'running' });
                if (!executionContext.target) {
                    emit('error', { message: 'No target defined. Please connect a Target node first.' });
                    emit('node-status', { nodeId: currentNode.id, status: 'failed' });
                    throw new Error('Missing target');
                }

                log(`Starting Enhanced Port Scan on ${executionContext.target}...`);
                const results = await runPortScan(executionContext.target);
                log(`Scan Complete. Found ${results.ports.length} open ports.`);

                if (results.osGuess !== 'Unknown') {
                    log(`OS Inference: ${results.osGuess}`);
                }
                if (results.firewallDetected) {
                    log('WARNING: Firewall detected (filtered ports found).');
                }

                // Save Findings to DB
                if (flowId) {
                    // 1. Open Ports with Version Info
                    for (const port of results.ports) {
                        await prisma.finding.create({
                            data: {
                                executionId,
                                title: `Open Port ${port.port}/${port.protocol}`,
                                description: `Service: ${port.service}\nVersion: ${port.version || 'Unknown'}`,
                                severity: 'Medium',
                                host: executionContext.target,
                                port: port.port
                            }
                        });
                    }

                    // 2. OS Detection Finding
                    if (results.osGuess !== 'Unknown') {
                        await prisma.finding.create({
                            data: {
                                executionId,
                                title: 'OS Detected',
                                description: `Operating System inferred from service banners: ${results.osGuess}`,
                                severity: 'Info',
                                host: executionContext.target
                            }
                        });
                    }

                    // 3. Firewall Detection Finding
                    if (results.firewallDetected) {
                        await prisma.finding.create({
                            data: {
                                executionId,
                                title: 'Firewall Detected',
                                description: 'Nmap detected filtered ports, indicating the presence of a firewall or packet filter.',
                                severity: 'Low',
                                host: executionContext.target
                            }
                        });
                    }
                }

                emit('node-status', { nodeId: currentNode.id, status: 'success' });
            }
            else if (currentNode.type === 'phishing') {
                emit('node-status', { nodeId: currentNode.id, status: 'running' });
                const successRate = currentNode.data.successRate || 30;
                log(`Launching Phishing Campaign (Success Rate: ${successRate}%)...`);

                const result = await simulatePhishing(successRate);
                log(result.details);

                if (!result.success) {
                    log('Phishing failed. Stopping attack chain.');
                    emit('node-status', { nodeId: currentNode.id, status: 'failed' });
                    currentNode = undefined; // Stop execution
                    continue;
                }

                // Save Finding
                if (flowId) {
                    await prisma.finding.create({
                        data: {
                            executionId,
                            title: 'Phishing Successful',
                            description: result.details,
                            severity: 'High',
                            host: 'target-user'
                        }
                    });
                }

                emit('node-status', { nodeId: currentNode.id, status: 'success' });
            }
            else if (currentNode.type === 'payload') {
                emit('node-status', { nodeId: currentNode.id, status: 'running' });
                const type = currentNode.data.payloadType || 'reverse_shell';
                log(`Dropping Payload: ${type}...`);

                const result = await simulatePayload(type);
                log(result.details);

                if (flowId) {
                    await prisma.finding.create({
                        data: {
                            executionId,
                            title: `Payload Executed: ${type}`,
                            description: result.details,
                            severity: 'Critical',
                            host: executionContext.target || 'unknown'
                        }
                    });
                }

                emit('node-status', { nodeId: currentNode.id, status: 'success' });
            }
            else if (currentNode.type === 'c2') {
                emit('node-status', { nodeId: currentNode.id, status: 'running' });
                const lhost = currentNode.data.lhost || '127.0.0.1';
                const lport = currentNode.data.lport || 4444;
                log(`Establishing C2 Connection to ${lhost}:${lport}...`);

                await simulateC2(lhost, lport);
                log('C2 Session Established. We are in.');

                if (flowId) {
                    await prisma.finding.create({
                        data: {
                            executionId,
                            title: 'C2 Session Established',
                            description: `Connected to ${lhost}:${lport}`,
                            severity: 'Critical',
                            host: executionContext.target || 'unknown'
                        }
                    });
                }

                emit('node-status', { nodeId: currentNode.id, status: 'success' });
            }
            else {
                // Default simulation for other nodes
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // Determine next node
            const outgoers = edges.filter(e => e.source === currentNode!.id);

            if (outgoers.length === 0) {
                currentNode = undefined;
            } else if (outgoers.length === 1) {
                const edge = outgoers[0];
                currentNode = edge ? nodes.find(n => n.id === edge.target) : undefined;
            } else {
                // Branching Logic
                if (currentNode.type === 'condition') {
                    // Mock Logic: Random
                    const isTrue = Math.random() > 0.5;
                    const handleId = isTrue ? 'true' : 'false';

                    log(`Condition evaluated to: ${isTrue ? 'TRUE' : 'FALSE'}`);

                    const edge = outgoers.find(e => e.sourceHandle === handleId);
                    currentNode = edge ? nodes.find(n => n.id === edge.target) : undefined;
                } else {
                    // Default to first
                    const edge = outgoers[0];
                    currentNode = edge ? nodes.find(n => n.id === edge.target) : undefined;
                }
            }
        }

        emit('execution-end', { status: 'completed' });
        log('Execution completed successfully.');

        if (flowId) {
            await prisma.execution.update({
                where: { id: executionId },
                data: { status: 'completed', completedAt: new Date() }
            });
        }

    } catch (error: any) {
        emit('error', { message: `Execution failed: ${error.message}` });
        if (flowId) {
            await prisma.execution.update({
                where: { id: executionId },
                data: { status: 'failed', completedAt: new Date() }
            });
        }
    }
};
