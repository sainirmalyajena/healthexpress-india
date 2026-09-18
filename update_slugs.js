const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

function generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function updateSlugs() {
    const doctors = await prisma.doctor.findMany();
    for (const doc of doctors) {
        const slug = generateSlug(doc.name);
        try {
            await prisma.doctor.update({
                where: { id: doc.id },
                data: { slug }
            });
            console.log(`Updated ${doc.name} -> ${slug}`);
        } catch (e) {
            console.error(`Failed to update ${doc.name}:`, e.message);
        }
    }
}

updateSlugs().finally(() => prisma.$disconnect());
