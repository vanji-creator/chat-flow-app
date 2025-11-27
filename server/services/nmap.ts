import { spawn } from 'child_process';

export const runPortScan = (target: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        console.log(`[Nmap] Starting enhanced scan for ${target}...`);

        // Run Nmap with Service Version Detection (-sV)
        // -p 80,443,22,8080,3000,5432 (common ports)
        // --version-intensity 5 (default)
        // -oG - (grepable output)
        const nmap = spawn('nmap', ['-sV', '--version-intensity', '5', '-p', '80,443,22,8080,3000,5432', '-oG', '-', target]);

        let output = '';
        let errorOutput = '';

        nmap.stdout.on('data', (data) => {
            output += data.toString();
        });

        nmap.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        nmap.on('close', (code) => {
            if (code !== 0) {
                console.error(`[Nmap] Error: ${errorOutput}`);
                reject(new Error(`Nmap failed with code ${code}`));
                return;
            }

            console.log(`[Nmap] Scan complete for ${target}. Parsing results...`);

            const ports: any[] = [];
            let osGuess = 'Unknown';
            let firewallDetected = false;

            const lines = output.split('\n');

            lines.forEach(line => {
                if (line.includes('Ports:')) {
                    const portSection = line.split('Ports: ')[1];
                    if (portSection) {
                        const portEntries = portSection.split(', ');
                        portEntries.forEach(entry => {
                            // Format: Port/State/Protocol/Owner/Service/RPC/Version/
                            // Example: 22/open/tcp//ssh//OpenSSH 9.6p1 Ubuntu 3ubuntu13.14 (Ubuntu Linux; protocol 2.0)/
                            const parts = entry.split('/');
                            const port = parseInt(parts[0]);
                            const state = parts[1];
                            const protocol = parts[2];
                            const service = parts[4] || 'unknown';
                            const version = parts[6] || '';

                            if (state === 'open') {
                                ports.push({
                                    port,
                                    state,
                                    service,
                                    version,
                                    protocol
                                });

                                // Simple OS Inference from banner
                                if (version.toLowerCase().includes('ubuntu')) osGuess = 'Ubuntu Linux';
                                if (version.toLowerCase().includes('windows')) osGuess = 'Windows';
                                if (version.toLowerCase().includes('debian')) osGuess = 'Debian Linux';
                                if (version.toLowerCase().includes('centos')) osGuess = 'CentOS Linux';
                            } else if (state === 'filtered') {
                                firewallDetected = true;
                            }
                        });
                    }
                }
            });

            resolve({
                target,
                status: 'up',
                ports,
                osGuess,
                firewallDetected,
                timestamp: new Date().toISOString(),
                raw: output
            });
        });
    });
};
