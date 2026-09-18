const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log("Testing connection...");
        await prisma.$connect();
        console.log("Connected successfully!");
        const leads = await prisma.lead.count();
        console.log("Lead count: ", leads);
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}
testConnection();
