const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
    });
    console.log(leads.map(l => ({ name: l.fullName, phone: l.phone, createdAt: l.createdAt })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
