import prisma from './services/db';

async function verifyData() {
    console.log('Verifying DB Data...');

    const executions = await prisma.execution.findMany({
        include: { findings: true }
    });

    console.log(`Found ${executions.length} executions.`);

    for (const exec of executions) {
        console.log(`Execution ${exec.id}: Status=${exec.status}, Findings=${exec.findings.length}`);
        exec.findings.forEach(f => console.log(` - Finding: ${f.title} (${f.severity})`));
    }
}

verifyData()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
