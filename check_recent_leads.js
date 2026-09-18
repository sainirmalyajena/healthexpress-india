require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');

async function checkRecentImports() {
    const prisma = new PrismaClient();
    try {
        const recentDate = new Date('2026-09-09T00:00:00Z');
        
        const count = await prisma.lead.count({
            where: {
                sourcePage: 'CSV Import',
                createdAt: {
                    gte: recentDate
                }
            }
        });
        
        console.log(`Found ${count} recent CSV imported leads.`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkRecentImports();
