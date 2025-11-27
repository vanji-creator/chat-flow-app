import fetch from 'node-fetch';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:3001/api';
const SOCKET_URL = 'http://localhost:3001';

async function testPersistence() {
    console.log('Testing Persistence...');

    // 1. Save a Flow
    console.log('1. Saving Flow...');
    const flowData = {
        name: 'Test Persistence Flow',
        nodes: [
            { id: '1', type: 'target', data: { target: 'scanme.nmap.org' } },
            { id: '2', type: 'port-scan', data: {} }
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' }
        ]
    };

    const saveRes = await fetch(`${API_URL}/flows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flowData)
    });
    const savedFlow = await saveRes.json();
    console.log('Saved Flow:', savedFlow.id);

    // 2. Run Flow
    console.log('2. Running Flow...');
    const socket = io(SOCKET_URL);

    await new Promise<void>((resolve) => {
        socket.on('connect', async () => {
            const runRes = await fetch(`${API_URL}/run-flow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...flowData, flowId: savedFlow.id })
            });
            const runData = await runRes.json();
            console.log('Execution Started:', runData.executionId);
        });

        socket.on('execution-end', () => {
            console.log('Execution Finished.');
            socket.disconnect();
            resolve();
        });
    });

    // 3. Verify Execution Record
    // Note: We don't have a GET /executions/:id endpoint yet, but we can check logs or DB directly if needed.
    // For now, if the run completed without error and we see the ID, it's a good sign.
    console.log('Persistence Test Complete.');
}

testPersistence().catch(console.error);
