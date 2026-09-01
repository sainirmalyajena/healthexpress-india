const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function test() {
    try {
        const c = await prisma.lead.findMany({
            select: { city: true },
            distinct: ['city'],
            where: { city: { not: undefined } }
        });
        console.log(c);
    } catch(e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
test();
