const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function test() {
    try {
        const c = await prisma.lead.findMany({
            where: { status: ['NEW', 'LOST'] }
        });
        console.log(c.length);
    } catch(e) {
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}
test();
