const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    const admins = await prisma.user.findMany({
        where: { role: 'admin' },
        select: { email: true, name: true }
    });
    console.log(admins);
}

main();
