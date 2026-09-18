require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function cleanupDuplicates() {
    const leads = await prisma.lead.groupBy({
        by: ['phone'],
        _count: { phone: true },
        having: {
            phone: { _count: { gt: 1 } }
        }
    });

    let deletedCount = 0;
    
    for (const l of leads) {
        const dups = await prisma.lead.findMany({
            where: { phone: l.phone },
            orderBy: [
                { updatedAt: 'desc' }, // Keep the most recently updated one
                { createdAt: 'desc' }
            ]
        });
        
        // dups[0] is the one we keep.
        const toDelete = dups.slice(1).map(d => d.id);
        
        if (toDelete.length > 0) {
            await prisma.lead.deleteMany({
                where: { id: { in: toDelete } }
            });
            deletedCount += toDelete.length;
            console.log(`Deleted ${toDelete.length} duplicates for phone ${l.phone}`);
        }
    }
    console.log(`Successfully deleted ${deletedCount} duplicate leads total.`);
}

cleanupDuplicates().catch(console.error).finally(() => prisma.$disconnect());
