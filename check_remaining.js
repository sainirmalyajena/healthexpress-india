require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');

async function checkRemainingLeads() {
    const prisma = new PrismaClient();
    try {
        const count = await prisma.lead.count({
            where: {
                sourcePage: 'CSV Import'
            }
        });
        console.log(`Found ${count} remaining leads imported via CSV Import.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkRemainingLeads();
