import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
    const session = await getAdminSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // 1. Fetch active team coordinators
    const coordinators = await prisma.user.findMany({
        where: { role: 'team' },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
    });

    if (coordinators.length < 2) {
        return NextResponse.json({ error: 'Need at least 2 active team members to rebalance leads.' }, { status: 400 });
    }

    // 2. Fetch all active leads (excluding CLOSED and LOST)
    const activeLeads = await prisma.lead.findMany({
        where: {
            status: { notIn: ['CLOSED', 'LOST'] }
        },
        select: {
            id: true,
            assignedUserId: true,
            status: true,
            createdAt: true
        },
        orderBy: { createdAt: 'asc' }
    });

    const totalActive = activeLeads.length;
    if (totalActive === 0) {
        return NextResponse.json({ message: 'No active leads to rebalance', rebalancedCount: 0 });
    }

    // Target leads per coordinator
    const targetQuota = Math.floor(totalActive / coordinators.length);
    const remainder = totalActive % coordinators.length;

    // Group leads by current assignee
    const coordinatorIds = new Set(coordinators.map(c => c.id));
    const leadsByCoord: Record<string, typeof activeLeads> = {};
    for (const c of coordinators) {
        leadsByCoord[c.id] = [];
    }

    const poolToRedistribute: string[] = [];

    // Separate leads: unassigned or assigned to non-team (admin) go straight into pool
    for (const lead of activeLeads) {
        if (!lead.assignedUserId || !coordinatorIds.has(lead.assignedUserId)) {
            poolToRedistribute.push(lead.id);
        } else {
            leadsByCoord[lead.assignedUserId].push(lead);
        }
    }

    // For coordinators who have more than their quota, take the excess into the pool
    // (Prefer moving NEW, CONTACTED, or DNP leads first, leaving scheduled OPDs with their current coordinator)
    coordinators.forEach((coord, idx) => {
        const allowedQuota = targetQuota + (idx < remainder ? 1 : 0);
        const userLeads = leadsByCoord[coord.id];

        if (userLeads.length > allowedQuota) {
            // Sort so we take NEW / DNP / CONTACTED first to redistribute
            userLeads.sort((a, b) => {
                const priorityOrder: Record<string, number> = { NEW: 1, DNP: 2, CONTACTED: 3, FOLLOW_UP: 4 };
                const pA = priorityOrder[a.status] || 5;
                const pB = priorityOrder[b.status] || 5;
                return pA - pB;
            });

            const excess = userLeads.splice(allowedQuota);
            excess.forEach(l => poolToRedistribute.push(l.id));
        }
    });

    // Distribute pool to coordinators who are below their allowed quota
    let poolIndex = 0;
    const reassignments: { leadId: string; newUserId: string }[] = [];

    coordinators.forEach((coord, idx) => {
        const allowedQuota = targetQuota + (idx < remainder ? 1 : 0);
        const currentCount = leadsByCoord[coord.id].length;
        const needed = allowedQuota - currentCount;

        for (let i = 0; i < needed && poolIndex < poolToRedistribute.length; i++) {
            reassignments.push({
                leadId: poolToRedistribute[poolIndex],
                newUserId: coord.id
            });
            leadsByCoord[coord.id].push(activeLeads.find(l => l.id === poolToRedistribute[poolIndex])!);
            poolIndex++;
        }
    });

    // Any remaining leftover leads (edge cases)
    let roundRobinIdx = 0;
    while (poolIndex < poolToRedistribute.length) {
        const targetCoord = coordinators[roundRobinIdx % coordinators.length];
        reassignments.push({
            leadId: poolToRedistribute[poolIndex],
            newUserId: targetCoord.id
        });
        poolIndex++;
        roundRobinIdx++;
    }

    // Execute bulk updates in transactions in batches of 50
    const batchSize = 50;
    for (let i = 0; i < reassignments.length; i += batchSize) {
        const batch = reassignments.slice(i, i + batchSize);
        await prisma.$transaction(
            batch.map(item =>
                prisma.lead.update({
                    where: { id: item.leadId },
                    data: { assignedUserId: item.newUserId }
                })
            )
        );
    }

    // Build summary of new distribution
    const newDistribution = coordinators.map(c => ({
        id: c.id,
        name: c.name,
        activeLeadsCount: leadsByCoord[c.id].length
    }));

    return NextResponse.json({
        success: true,
        rebalancedCount: reassignments.length,
        totalActiveLeads: totalActive,
        targetQuota,
        newDistribution
    });
}
