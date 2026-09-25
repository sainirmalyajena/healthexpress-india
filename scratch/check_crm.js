const { PrismaClient } = require('./src/generated/prisma');

const supabaseUrl = "postgresql://postgres.ohugjztaproetvromytp:7809580328%40Sai@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: supabaseUrl
        }
    }
});

async function main() {
    try {
        console.log("Connecting to Supabase CRM database...");
        const count = await prisma.lead.count();
        console.log("✅ Total leads found in Supabase CRM:", count);

        const recent = await prisma.lead.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                fullName: true,
                phone: true,
                city: true,
                status: true,
                createdAt: true,
                referenceId: true
            }
        });

        console.log("\nMost Recent Leads in CRM:");
        console.table(recent);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
