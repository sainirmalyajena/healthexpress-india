import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function check() {
    const surgeries = await prisma.surgery.findMany({
        where: { name: { contains: 'ankle', mode: 'insensitive' } }
    });
    console.log(surgeries);
}
check().finally(() => prisma.$disconnect());
