const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
    const hospitals = await prisma.hospital.findMany();
    console.log(JSON.stringify(hospitals.map(h => ({ name: h.name, address: h.address })), null, 2));
}
main();
