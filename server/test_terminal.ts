import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
    console.log('Connected to server');

    // Test /nuclei command
    console.log('Sending: /nuclei localhost');
    socket.emit('terminal-command', '/nuclei localhost');
});

socket.on('terminal-output', (data) => {
    console.log(`[Output] Type: ${data.type}, Content: ${data.content}`);

    if (data.type === 'result' && data.content.includes('Nuclei')) {
        console.log('Nuclei test passed!');
        process.exit(0);
    }
});

setTimeout(() => {
    console.log('Timeout waiting for response');
    process.exit(1);
}, 5000);
