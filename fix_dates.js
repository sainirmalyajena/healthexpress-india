require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function fixFutureLeads() {
    try {
        const futureLeads = await prisma.lead.findMany({
            where: {
                createdAt: {
                    gt: new Date('2026-09-12T00:00:00Z')
                }
            }
        });
        
        let count = 0;
        for (const lead of futureLeads) {
            // Swap month and day: 2026-10-09 becomes 2026-09-10
            const d = lead.createdAt;
            const fixedDate = new Date(d.getFullYear(), d.getDate() - 1, d.getMonth() + 1, d.getHours(), d.getMinutes(), d.getSeconds());
            
            await prisma.lead.update({
                where: { id: lead.id },
                data: { createdAt: fixedDate }
            });
            count++;
        }
        console.log(`Fixed ${count} future leads by swapping month and day.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

fixFutureLeads();
