const { PrismaClient } = require('./src/generated/prisma');

const supabaseUrl = "postgresql://postgres.ohugjztaproetvromytp:7809580328%40Sai@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";
const prisma = new PrismaClient({
    datasources: { db: { url: supabaseUrl } }
});

async function main() {
    try {
        const admin = await prisma.user.findFirst({
            where: { role: 'admin' },
            select: { id: true, name: true, email: true }
        });
        console.log(`Admin User: ${admin.name} (${admin.email}, ID: ${admin.id})`);

        const lasikSurgery = await prisma.surgery.findFirst({
            where: { name: { contains: 'LASIK', mode: 'insensitive' } },
            select: { id: true, name: true }
        });
        console.log(`Surgery: ${lasikSurgery.name} (${lasikSurgery.id})`);

        // Check if Suresh Patil already exists
        const phone = "+919326875911";
        const existing = await prisma.lead.findFirst({
            where: { phone: { contains: "9326875911" } }
        });

        if (existing) {
            console.log(`[SKIP] Suresh Patil already exists: ${existing.referenceId}`);
            return;
        }

        const referenceId = `HE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const notes = [
            `[Meta Ads Import]`,
            `Assigned To: ${admin.name} (${admin.email})`,
            `Platform: FB`,
            `Form: LASIK Special Offer – Consultation new-copy`,
            `Campaign: New Campaign Video`,
            `Ad Name: New Engagement Ad`,
            `Preferred Centre: vashi, navi mumbai`,
            `Looking for LASIK: yes`,
            `Has Insurance: no`,
            `City: Pune`
        ].join('\n');

        const newLead = await prisma.lead.create({
            data: {
                referenceId,
                fullName: "Suresh Patil",
                phone: phone,
                city: "Pune",
                surgeryId: lasikSurgery.id,
                assignedUserId: admin.id,
                description: `Meta Ad Lead (Assigned to: ${admin.name}) - LASIK inquiry from FB`,
                insurance: "NO",
                status: "NEW",
                notes: notes,
                sourcePage: "Meta Ads",
                utmSource: "fb",
                utmCampaign: "New Campaign Video",
                utmContent: "New Engagement Ad",
                utmMedium: "cpc",
                createdAt: new Date("2026-09-23T10:55:28+05:30")
            }
        });

        console.log(`✅ Successfully added Suresh Patil! Ref: ${newLead.referenceId}, Assigned to: ${admin.name}`);

        const totalCount = await prisma.lead.count();
        console.log(`Total leads in Supabase CRM now: ${totalCount}`);
    } catch (e) {
        console.error("Error inserting lead:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
