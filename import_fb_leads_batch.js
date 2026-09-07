const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const leadsToImport = [
    {
        name: "Aniket More", phone: "+919326660437", city: "vashi, navi mumbai", source: "fb",
        notes: "Location: vashi, navi mumbai", date: "2026-09-04T13:50:04-05:00", status: "NEW"
    },
    {
        name: "Hitesh S Adhvaryoo", phone: "+919328576219", city: "Halol Gujarat", source: "fb",
        notes: "Location: vashi, navi mumbai | Note: amir", date: "2026-09-04T14:01:15-05:00", status: "NEW"
    },
    {
        name: "Mqsood Maniyar", phone: "+919029256289", city: "Bhiwandi", source: "fb",
        notes: "Location: kalyan | Note: will update the opd cash cataract", date: "2026-09-05T03:40:03-05:00", status: "FOLLOW_UP"
    },
    {
        name: "Shiva Rathore", phone: "+917020030306", city: "vashi, navi mumbai", source: "ig",
        notes: "Location: vashi, navi mumbai | Note: no proper responce", date: "2026-09-05T09:06:43-05:00", status: "CONTACTED"
    },
    {
        name: "Ashok", phone: "+917678369320", city: "Indirapuram Ghaziabad", source: "ig",
        notes: "Location: delhi | Note: Planning coming week call back on 13th will update the date pitched noida asg and sharp sight preet bihar", date: "2026-09-05T10:59:00-05:00", status: "FOLLOW_UP"
    },
    {
        name: "Asha Shankar", phone: "+919619965519", city: "Panvel", source: "ig",
        notes: "Location: vashi, navi mumbai | Note: call back", date: "2026-09-05T11:11:16-05:00", status: "CALL_BACK"
    },
    {
        name: "Sushil Daswant", phone: "+917972355827", city: "mumbai", source: "fb",
        notes: "Location: vashi, navi mumbai | Note: switch off", date: "2026-09-05T12:34:14-05:00", status: "CALL_BACK"
    },
    {
        name: "@Ruhis makeover", phone: "+919702389874", city: "Mumbai Suburban", source: "ig",
        notes: "Location: jogeshwari | Note: num busy", date: "2026-09-05T13:16:05-05:00", status: "CALL_BACK"
    },
    {
        name: "Khan Irshad", phone: "+919967207040", city: "ghatkopar", source: "ig",
        notes: "Location: ghatkopar | Note: OPD booked", date: "2026-09-05T13:19:34-05:00", status: "OPD_SCHEDULED"
    }
];

async function main() {
    for (const lead of leadsToImport) {
        let surgeryId = null;
        const s = await prisma.surgery.findFirst({
            where: { name: { contains: 'Lasik', mode: 'insensitive' } }
        });
        if (s) surgeryId = s.id;

        const existingLead = await prisma.lead.findFirst({
            where: { phone: { endsWith: lead.phone.slice(-10) } }
        });

        if (existingLead) {
            await prisma.lead.update({
                where: { id: existingLead.id },
                data: {
                    status: lead.status,
                    notes: (existingLead.notes ? existingLead.notes + '\n\n' : '') + lead.notes,
                    assignedUserId: "cmtjtlphm0000wgekj9fs4xj7",
                    city: lead.city || existingLead.city
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
                    status: lead.status,
                    notes: `[Facebook Ads Import]\nForm: LASIK Special Offer – Consultation new\n${lead.notes}`,
                    sourcePage: 'Meta Ads',
                    utmSource: lead.source,
                    utmCampaign: "New Campaign Video",
                    createdAt: new Date(lead.date),
                    description: lead.notes.includes('Note:') ? lead.notes.split('Note:')[1].trim() : 'Added via Meta Ads import',
                    assignedUserId: "cmtjtlphm0000wgekj9fs4xj7",
                    surgeryId
                }
            });
            console.log(`Created new lead: ${lead.name} -> ${lead.status}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
