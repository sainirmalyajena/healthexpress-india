const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function run() {
    const leads = await prisma.lead.findMany({ take: 5, select: { phone: true, fullName: true, status: true } });
    console.log(leads);
}

run().catch(console.error).finally(() => prisma.$disconnect());
