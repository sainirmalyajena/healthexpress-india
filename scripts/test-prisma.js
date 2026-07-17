const { PrismaClient } = require('../src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    console.log('Querying leads from database...');
    const count = await prisma.lead.count();
    console.log(`Total leads in DB: ${count}`);
    
    if (count > 0) {
        const latestLeads = await prisma.lead.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' }
        });
        console.log('Latest 3 leads:', JSON.stringify(latestLeads, null, 2));
    } else {
        console.log('Creating a dummy lead to verify write capability...');
        
        // Find a surgery to link to
        const surgery = await prisma.surgery.findFirst();
        
        if (surgery) {
            const newLead = await prisma.lead.create({
                data: {
                    fullName: 'Admin Test User',
                    phone: '+91 9999999999',
                    city: 'Test City',
                    surgeryId: surgery.id,
                    description: 'This is an automated test lead to verify database connections.',
                    insurance: 'NO',
                    sourcePage: 'test-script',
                    status: 'NEW',
                    referenceId: 'TEST-123456'
                }
            });
            console.log('Successfully created test lead:', newLead.id);
        } else {
            console.log('No surgeries found in DB. Cannot create linked lead.');
        }
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
