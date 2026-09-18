const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function run() {
    const hospitals = await prisma.hospital.findMany({
        where: { name: { contains: "Sharp", mode: 'insensitive' } }
    });
    console.log("Hospitals found:", JSON.stringify(hospitals, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
