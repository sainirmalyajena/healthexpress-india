const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.document.count();
        console.log(`There are ${count} documents in the database.`);
    } catch (e) {
        console.error('Error counting documents. This might be because the schema is out of sync with the DB.');
    } finally {
        await prisma.$disconnect();
    }
}

main();
