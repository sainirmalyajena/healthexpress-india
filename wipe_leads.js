require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');

async function wipeTodayImportedLeads() {
    const prisma = new PrismaClient();
    try {
        const startOfToday = new Date('2026-09-11T00:00:00Z');
        
        const count = await prisma.lead.count({
            where: {
                sourcePage: 'CSV Import',
                createdAt: {
                    gte: startOfToday
                }
            }
        });

        console.log(`Found ${count} leads imported today.`);

        if (count > 0) {
            const deleteResult = await prisma.lead.deleteMany({
                where: {
                    sourcePage: 'CSV Import',
                    createdAt: {
                        gte: startOfToday
                    }
                }
            });
            console.log(`Deleted ${deleteResult.count} leads successfully.`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

wipeTodayImportedLeads();
