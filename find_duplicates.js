const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function findDuplicates() {
    const leads = await prisma.lead.groupBy({
        by: ['phone'],
        _count: { phone: true },
        having: {
            phone: { _count: { gt: 1 } }
        }
    });

    console.log(`Found ${leads.length} phone numbers with duplicate entries.`);
    let totalDuplicates = 0;
    
    for (const l of leads.slice(0, 5)) {
        const dups = await prisma.lead.findMany({
            where: { phone: l.phone },
            select: { id: true, fullName: true, status: true, createdAt: true },
            orderBy: { createdAt: 'asc' }
        });
        console.log(`\nPhone: ${l.phone}`);
        dups.forEach(d => console.log(`  - ${d.fullName} | Status: ${d.status} | Created: ${d.createdAt}`));
        totalDuplicates += (dups.length - 1);
    }
    
    console.log(`\nTotal estimated duplicate rows to clean up across the whole DB: ${leads.reduce((sum, l) => sum + (l._count.phone - 1), 0)}`);
}

findDuplicates().catch(console.error).finally(() => prisma.$disconnect());
