import { prisma } from '../src/lib/prisma';

async function main() {
    const doctors = await prisma.doctor.findMany({
        include: {
            surgeries: {
                select: { id: true, name: true, category: true }
            }
        }
    });

    for (const doc of doctors) {
        console.log(`\nDoctor: ${doc.name} (${doc.qualification})`);
        console.log(`Specialties based on about: ${doc.about.substring(0, 100)}...`);
        console.log(`Linked Surgeries Count: ${doc.surgeries.length}`);
        console.log(`Categories: ${[...new Set(doc.surgeries.map(s => s.category))].join(', ')}`);
    }

    await prisma.$disconnect();
}

main();
