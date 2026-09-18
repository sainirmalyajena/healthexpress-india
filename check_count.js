require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkLeads() {
    try {
        const count = await prisma.lead.count();
        console.log("Total leads in DB:", count);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkLeads();
