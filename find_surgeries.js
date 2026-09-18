const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function run() {
    const surgeries = await prisma.surgery.findMany();
    console.log(surgeries.map(s => ({id: s.id, name: s.name})));
}

run().catch(console.error).finally(() => prisma.$disconnect());
