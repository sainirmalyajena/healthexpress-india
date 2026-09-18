require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');

async function wipeRecentImports() {
    const prisma = new PrismaClient();
    try {
        const recentDate = new Date('2026-09-09T00:00:00Z');
        let success = false;
        let retries = 5;
        while (!success && retries > 0) {
            try {
                const deleteResult = await prisma.lead.deleteMany({
                    where: {
                        sourcePage: 'CSV Import',
                        createdAt: {
                            gte: recentDate
                        }
                    }
                });
                console.log(`Deleted ${deleteResult.count} recent CSV imported leads.`);
                success = true;
            } catch (e) {
                console.log(`Retry... ${retries} left. Error: ${e.message}`);
                retries--;
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    } finally {
        await prisma.$disconnect();
    }
}

wipeRecentImports();
