import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function test() {
    try {
        const data = {
            fullName: "Test User",
            phone: "+919999999999",
            city: "Test City",
            surgeryName: "Test Surgery",
            notes: "Test"
        };
        
        let matchedSurgeryId = null;
        if (data.surgeryName) {
            const surgery = await prisma.surgery.findFirst({
                where: { name: { contains: data.surgeryName, mode: 'insensitive' } }
            });
            if (surgery) {
                matchedSurgeryId = surgery.id;
            }
        }

        const lead = await prisma.lead.create({
            data: {
                fullName: data.fullName || 'Unknown',
                phone: data.phone || 'Unknown',
                email: null,
                city: data.city || null,
                sourcePage: 'Google Sheets', // Wait! The schema is sourcePage, not source!
                utmSource: 'google_sheets',
                description: data.notes || null,
                surgeryId: matchedSurgeryId,
                status: 'NEW',
            }
        });
        console.log(lead);
    } catch (e) {
        console.error(e);
    }
}
test();
