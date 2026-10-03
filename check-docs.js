const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
    const docs = await prisma.doctor.findMany({take: 2});
    console.log(JSON.stringify(docs, null, 2));
}
main();
