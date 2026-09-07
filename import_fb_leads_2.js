const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const leadsToImport = [
    {
        name: "bobytalwar",
        phone: "+919667826651",
        city: "delhi",
        surgery: "Lasik",
        source: "ig",
        campaign: "New Campaign Video",
        adSet: "New Engagement Ad Set",
        adName: "New Engagement Ad",
        formName: "LASIK Special Offer – Consultation new",
        notes: "Location context: delhi | Answer 1: yes",
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7" // Amir's ID based on previous import
    },
    {
        name: "Amrut Bhandare",
        phone: "+919082780915",
        city: "Mumbai, ghatkopar",
        surgery: "Lasik",
        source: "fb",
        campaign: "New Campaign Video",
        adSet: "New Engagement Ad Set",
        adName: "New Engagement Ad",
        formName: "LASIK Special Offer – Consultation new",
        notes: "Location context: ghatkopar | Answer 1: no",
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    }
];

async function main() {
    for (const lead of leadsToImport) {
        
        let notes = `[Facebook Ads Import]\n`;
        notes += `Form: ${lead.formName}\n`;
        notes += `Campaign: ${lead.campaign}\n`;
        notes += `Platform: ${lead.source}\n`;
        if (lead.notes) notes += `Extra Answers: ${lead.notes}\n`;

        let surgeryId = null;
        if (lead.surgery) {
            const s = await prisma.surgery.findFirst({
                where: { name: { contains: lead.surgery, mode: 'insensitive' } }
            });
            if (s) surgeryId = s.id;
        }

        const existingLead = await prisma.lead.findFirst({
            where: { phone: { endsWith: lead.phone.slice(-10) } }
        });

        if (existingLead) {
            await prisma.lead.update({
                where: { id: existingLead.id },
                data: {
                    status: 'NEW',
                    notes: (existingLead.notes ? existingLead.notes + '\n\n' : '') + notes,
                    assignedUserId: lead.assignedUserId,
                    city: lead.city || existingLead.city,
                    surgeryId: surgeryId || existingLead.surgeryId
                }
            });
            console.log(`Updated existing lead: ${lead.name}`);
        } else {
            const referenceId = `HE-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            await prisma.lead.create({
                data: {
                    referenceId,
                    fullName: lead.name,
                    phone: lead.phone,
                    city: lead.city || "Unknown",
                    status: 'NEW',
                    notes: notes,
                    sourcePage: 'Meta Ads',
                    utmSource: lead.source,
                    utmCampaign: lead.campaign,
                    utmContent: lead.adName,
                    description: 'Added via Meta Ads import',
                    assignedUserId: lead.assignedUserId,
                    surgeryId
                }
            });
            console.log(`Created new lead: ${lead.name}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
