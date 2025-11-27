import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
    console.log('Connected to server');

    // Test /subfinder command
    console.log('Sending: /subfinder localhost');
    socket.emit('terminal-command', '/subfinder localhost');
});

socket.on('terminal-output', (data) => {
    console.log(`[Output] Type: ${data.type}, Content: ${data.content}`);

    if (data.type === 'data' && data.content.includes('admin')) {
        console.log('Subfinder test passed!');
        process.exit(0);
    }
});

setTimeout(() => {
    console.log('Timeout waiting for response');
    process.exit(1);
}, 5000);
