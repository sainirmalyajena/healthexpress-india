const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function test() {
    try {
        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where: {},
                include: { surgery: true, hospital: true },
                orderBy: { createdAt: 'desc' },
                skip: 0, take: 20
            }),
            prisma.lead.count({ where: {} })
        ]);
        console.log('Leads:', leads.length, 'Total:', total);
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
test();
