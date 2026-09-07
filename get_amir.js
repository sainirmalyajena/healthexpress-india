const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    const amir = await prisma.user.findFirst({
        where: { name: { contains: 'amir', mode: 'insensitive' } }
    });
    console.log("Amir ID:", amir?.id);
}

main();
