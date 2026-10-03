require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    const leads = await prisma.lead.findMany({
        where: {
            notes: { contains: 'Fields: {' }
        }
    });

    for (const lead of leads) {
        try {
            // Extract the JSON string
            const match = lead.notes.match(/Fields: (\{.*\})/);
            if (match && match[1]) {
                const rawFields = JSON.parse(match[1]);
                let newNotesPart = '\n--- Lead Details ---\n';
                
                let hasCard = lead.hasCard;

                for (const [key, val] of Object.entries(rawFields)) {
                    newNotesPart += `${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${val}\n`;
                    
                    if (key.toLowerCase().includes('insurance') || key.toLowerCase().includes('health')) {
                        if (String(val).toLowerCase() === 'yes') hasCard = true;
                    }
                }

                const newNotes = lead.notes.replace(/Fields: \{.*\}/, newNotesPart);

                await prisma.lead.update({
                    where: { id: lead.id },
                    data: { notes: newNotes, hasCard }
                });
                console.log(`Updated lead ${lead.id}`);
            }
        } catch (e) {
            console.error(e);
        }
    }
    console.log('Finished updating old leads!');
}

main().catch(console.error);
