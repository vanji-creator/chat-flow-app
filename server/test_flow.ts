import { io } from 'socket.io-client';
import fetch from 'node-fetch';

const SOCKET_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:3001/api/run-flow';

const flowPayload = {
    nodes: [
        {
            id: '1',
            type: 'target',
            data: { target: 'scanme.nmap.org' },
            position: { x: 0, y: 0 }
        },
        {
            id: '2',
            type: 'port-scan',
            data: {},
            position: { x: 200, y: 0 }
        }
    ],
    edges: [
        {
            id: 'e1-2',
            source: '1',
            target: '2'
        }
    ]
};

const socket = io(SOCKET_URL);

console.log('Connecting to backend...');

socket.on('connect', async () => {
    console.log('Connected! Sending flow...');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(flowPayload)
        });

        const data = await response.json();
        console.log('Flow started:', data);
    } catch (err) {
        console.error('Failed to start flow:', err);
        process.exit(1);
    }
});

socket.on('log', (data) => {
    console.log('[SERVER LOG]:', data.message);
});

socket.on('node-start', (data) => {
    console.log('[NODE START]:', data.nodeId);
});

socket.on('execution-end', () => {
    console.log('Execution finished successfully.');
    socket.disconnect();
    process.exit(0);
});

socket.on('error', (data) => {
    console.error('[ERROR]:', data.message);
    process.exit(1);
});
