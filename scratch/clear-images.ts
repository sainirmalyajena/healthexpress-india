import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing fake images...');
    await prisma.doctor.updateMany({
        data: { image: '' }
    });
    console.log('Images cleared!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
