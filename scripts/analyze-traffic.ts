
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('--- TRAFFIC & PERFORMANCE ANALYSIS (Based on DB) ---');

    // 1. Leads by Date (Trend)
    const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'asc' }
    });

    const leadsByDate: Record<string, number> = {};
    leads.forEach(l => {
        const date = l.createdAt.toISOString().split('T')[0];
        leadsByDate[date] = (leadsByDate[date] || 0) + 1;
    });

    console.log('\n📅 Enquiries per Day (Conversion Trend):');
    Object.entries(leadsByDate).slice(-7).forEach(([date, count]) => {
        console.log(`- ${date}: ${count} leads`);
    });

    // 2. Conversion Rates (Proxy)
    console.log('\n📊 Conversion Funnel (Status):');
    const statusCounts: Record<string, number> = {};
    leads.forEach(l => {
        statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
    });
    console.table(statusCounts);

    // 3. Top Interest Areas
    const leadsBySurgery: Record<string, number> = {};
    for (const l of leads) {
        // Fetch surgery name if needed, but doing simple ID aggregation for speed or relying on previous include
        // Let's just use the ID for now or fetch aggregated
        if (l.surgeryId) {
            leadsBySurgery[l.surgeryId] = (leadsBySurgery[l.surgeryId] || 0) + 1;
        }
    }

    // Quick fetch of top surgeries names
    const topSurgeryIds = Object.entries(leadsBySurgery).sort(([, a], [, b]) => b - a).slice(0, 3).map(([id]) => id);
    if (topSurgeryIds.length > 0) {
        const topSurgeries = await prisma.surgery.findMany({
            where: { id: { in: topSurgeryIds } }
        });

        console.log('\n🏆 Top Requested Surgeries:');
        topSurgeries.forEach(s => {
            console.log(`- ${s.name}: ${leadsBySurgery[s.id]} leads`);
        });
    }

}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
