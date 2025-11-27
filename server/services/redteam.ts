export const simulatePhishing = (successRate: number): Promise<{ success: boolean; details: string }> => {
    return new Promise((resolve) => {
        console.log(`[RedTeam] Simulating Phishing Campaign (Success Rate: ${successRate}%)...`);

        setTimeout(() => {
            const roll = Math.random() * 100;
            const success = roll <= successRate;

            if (success) {
                resolve({
                    success: true,
                    details: `User clicked the link! (Roll: ${roll.toFixed(1)}, Threshold: ${successRate})`
                });
            } else {
                resolve({
                    success: false,
                    details: `User ignored the email. (Roll: ${roll.toFixed(1)}, Threshold: ${successRate})`
                });
            }
        }, 2000); // 2s delay
    });
};

export const simulatePayload = (type: string): Promise<{ success: boolean; details: string }> => {
    return new Promise((resolve) => {
        console.log(`[RedTeam] Executing Payload: ${type}...`);

        setTimeout(() => {
            resolve({
                success: true,
                details: `Payload ${type} executed successfully. Session established.`
            });
        }, 1500);
    });
};

export const simulateC2 = (lhost: string, lport: number): Promise<{ status: string }> => {
    return new Promise((resolve) => {
        console.log(`[RedTeam] Connecting to C2 at ${lhost}:${lport}...`);

        setTimeout(() => {
            resolve({ status: 'connected' });
        }, 1000);
    });
};
