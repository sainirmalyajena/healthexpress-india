const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function analyzeCRM() {
    const totalLeads = await prisma.lead.count();
    
    const leadsByStatus = await prisma.lead.groupBy({
        by: ['status'],
        _count: { status: true }
    });

    const leadsBySurgery = await prisma.lead.groupBy({
        by: ['surgeryId'],
        _count: { surgeryId: true }
    });

    const surgeries = await prisma.surgery.findMany({ select: { id: true, name: true } });
    const surgeryMap = {};
    surgeries.forEach(s => surgeryMap[s.id] = s.name);

    const leadsByCity = await prisma.lead.groupBy({
        by: ['city'],
        _count: { city: true },
        orderBy: { _count: { city: 'desc' } },
        take: 5
    });

    const leadsByAgent = await prisma.lead.groupBy({
        by: ['assignedUserId'],
        _count: { assignedUserId: true }
    });
    
    const users = await prisma.user.findMany({ select: { id: true, name: true } });
    const userMap = {};
    users.forEach(u => userMap[u.id] = u.name);

    const recentActivity = await prisma.activityLog.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
    });

    const emergencyLeads = await prisma.lead.count({ where: { isEmergency: true } });

    console.log("=== CRM DATA DUMP ===");
    console.log("Total Leads:", totalLeads);
    console.log("Emergency Leads:", emergencyLeads);
    console.log("\nStatuses:", JSON.stringify(leadsByStatus, null, 2));
    
    const surgeryStats = leadsBySurgery.map(l => ({ name: surgeryMap[l.surgeryId] || 'Unknown', count: l._count.surgeryId }));
    console.log("\nSurgeries:", JSON.stringify(surgeryStats, null, 2));
    
    console.log("\nTop Cities:", JSON.stringify(leadsByCity, null, 2));
    
    const agentStats = leadsByAgent.map(l => ({ agent: userMap[l.assignedUserId] || 'Unassigned', count: l._count.assignedUserId }));
    console.log("\nAgent Load:", JSON.stringify(agentStats, null, 2));
    
    console.log("\nActivity Logs (Last 7 Days):", recentActivity);
}

analyzeCRM().catch(console.error).finally(() => prisma.$disconnect());
