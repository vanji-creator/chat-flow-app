import { runPortScan } from './services/nmap';

async function testNmap() {
    const target = '127.0.0.1'; // Scan localhost
    console.log(`Testing Enhanced Nmap on ${target}...`);

    try {
        const results = await runPortScan(target);
        console.log('--- Scan Results ---');
        console.log(`Target: ${results.target}`);
        console.log(`Status: ${results.status}`);
        console.log(`OS Guess: ${results.osGuess}`);
        console.log(`Firewall Detected: ${results.firewallDetected}`);
        console.log(`Open Ports: ${results.ports.length}`);

        results.ports.forEach((p: any) => {
            console.log(` - Port ${p.port}/${p.protocol}: ${p.service} (Version: ${p.version})`);
        });

    } catch (error) {
        console.error('Scan failed:', error);
    }
}

testNmap();
