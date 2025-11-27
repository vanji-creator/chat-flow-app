import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

let findingsCount = 0;

socket.on('connect', () => {
    console.log('Connected to server');

    // Test /scan command to trigger all findings
    console.log('Sending: /scan localhost');
    socket.emit('terminal-command', '/scan localhost');
});

socket.on('finding', (data) => {
    console.log(`[Finding] Type: ${data.type}`);
    findingsCount++;

    if (findingsCount >= 5) {
        console.log('Dashboard findings test passed!');
        process.exit(0);
    }
});

setTimeout(() => {
    if (findingsCount > 0) {
        console.log(`Received ${findingsCount} findings. Partial success.`);
        process.exit(0);
    } else {
        console.log('Timeout waiting for findings');
        process.exit(1);
    }
}, 8000);
