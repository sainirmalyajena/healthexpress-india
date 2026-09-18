require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkLeads() {
    try {
        const count = await prisma.lead.count();
        console.log("Total leads:", count);

        const recentLeads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: { fullName: true, createdAt: true, status: true, sourcePage: true }
        });
        
        console.log("Top 10 Newest Leads:");
        recentLeads.forEach(l => {
            console.log(`- ${l.fullName} | Date: ${l.createdAt.toISOString()} | Status: ${l.status}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkLeads();
