import { prisma } from '../src/lib/prisma';

async function main() {
    console.log("Fixing doctor-surgery links...");
    
    // Get all OPHTHALMOLOGY surgeries
    const eyeSurgeries = await prisma.surgery.findMany({
        where: { category: 'OPHTHALMOLOGY' }
    });
    
    const eyeSurgeryIds = eyeSurgeries.map(s => ({ id: s.id }));

    // Fix the 4 doctors mapped incorrectly to all 146 surgeries
    const doctorEmailsToFix = [
        'dr.saumilsheth@envisioneye.com',
        'saumil.sheth@envisioneyehospital.in', // might be this one based on update script
        'dr.jatin@mumbaieyecare.com',
        'dr.himanshu@asgeyehospital.com',
        'dr.kamalkapur@sharpsight.in'
    ];

    for (const email of doctorEmailsToFix) {
        const doc = await prisma.doctor.findUnique({ where: { email } });
        if (doc) {
            console.log(`Fixing ${doc.name}...`);
            // First disconnect all
            await prisma.doctor.update({
                where: { id: doc.id },
                data: {
                    surgeries: { set: [] }
                }
            });
            // Then reconnect ONLY to Ophthalmology
            await prisma.doctor.update({
                where: { id: doc.id },
                data: {
                    surgeries: { connect: eyeSurgeryIds }
                }
            });
            console.log(`Fixed ${doc.name}. Now linked to ${eyeSurgeryIds.length} Ophthalmology surgeries only.`);
        }
    }
    
    // Wait, let's also fix by name just in case
    const namesToFix = ['Dr. Saumil Sheth', 'Saumil Sheth', 'Dr. Jatin Ashar', 'Dr. Himanshu Mehta', 'Dr. Kamal B. Kapur'];
    const docsByName = await prisma.doctor.findMany({
        where: { name: { in: namesToFix } }
    });
    
    for (const doc of docsByName) {
        // If not already fixed by email above
        if (!doctorEmailsToFix.includes(doc.email)) {
            console.log(`Fixing ${doc.name} (by name fallback)...`);
            await prisma.doctor.update({
                where: { id: doc.id },
                data: { surgeries: { set: [] } }
            });
            await prisma.doctor.update({
                where: { id: doc.id },
                data: { surgeries: { connect: eyeSurgeryIds } }
            });
        }
    }

    console.log("Done fixing doctor mappings.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
