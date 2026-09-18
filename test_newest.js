require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function getNewestLeads() {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: { fullName: true, createdAt: true, phone: true }
        });
        console.log("Top 10 Newest Leads:");
        leads.forEach(l => console.log(`${l.fullName} | ${l.createdAt}`));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

getNewestLeads();
