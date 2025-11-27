interface SubfinderResult {
    host: string;
    ip?: string;
}

// Mock implementation
export const runSubfinder = async (target: string): Promise<SubfinderResult[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { host: `admin.${target}`, ip: '192.168.1.5' },
                { host: `api.${target}`, ip: '192.168.1.6' },
                { host: `dev.${target}`, ip: '192.168.1.7' },
                { host: `mail.${target}`, ip: '192.168.1.8' },
                { host: `vpn.${target}`, ip: '192.168.1.9' },
                { host: `test.${target}`, ip: '192.168.1.10' },
                { host: `staging.${target}`, ip: '192.168.1.11' },
            ]);
        }, 2000);
    });
};
