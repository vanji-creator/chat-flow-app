import { io } from 'socket.io-client';
import fetch from 'node-fetch';

const SOCKET_URL = 'http://localhost:3001';
const API_URL = 'http://localhost:3001/api/run-flow';

const socket = io(SOCKET_URL);

// Define Red Team Flow: Phishing (100% success for test) -> Payload -> C2
const nodes = [
    { id: '1', type: 'phishing', data: { successRate: 100 }, position: { x: 0, y: 0 } },
    { id: '2', type: 'payload', data: { payloadType: 'reverse_shell' }, position: { x: 200, y: 0 } },
    { id: '3', type: 'c2', data: { lhost: '10.10.10.5', lport: 1337 }, position: { x: 400, y: 0 } }
];

const edges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' }
];

console.log('Connecting to backend...');

socket.on('connect', async () => {
    console.log('Connected! Sending Red Team Flow...');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nodes, edges })
        });

        const data = await response.json();
        console.log('Flow started:', data);
    } catch (err) {
        console.error('Failed to start flow:', err);
        process.exit(1);
    }
});

socket.on('log', (data) => {
    console.log('[LOG]:', data.message);
    if (data.message.includes('C2 Session Established')) {
        console.log('SUCCESS: Attack chain completed.');
        socket.disconnect();
        process.exit(0);
    }
});

socket.on('execution-end', () => {
    console.log('Execution finished.');
    socket.disconnect();
    process.exit(0);
});
