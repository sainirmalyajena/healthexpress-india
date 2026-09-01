const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function test() {
    try {
        const skip = NaN;
        await prisma.lead.findMany({ skip, take: 20 });
        console.log('Success');
    } catch(e) {
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}
test();
