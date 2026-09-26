import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (session.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden: Only administrators can update team call quotas.' }, { status: 403 });
        }

        const body = await req.json();
        const { userId, dailyCallQuota } = body;

        if (!userId || typeof dailyCallQuota !== 'number' || dailyCallQuota < 0) {
            return NextResponse.json({ error: 'Valid userId and positive dailyCallQuota are required.' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { dailyCallQuota: Math.floor(dailyCallQuota) }
        });

        return NextResponse.json({
            success: true,
            message: `Updated daily call quota for ${updatedUser.name} to ${updatedUser.dailyCallQuota}.`,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                dailyCallQuota: updatedUser.dailyCallQuota
            }
        });
    } catch (err: any) {
        console.error('Quota update error:', err);
        return NextResponse.json({ error: err.message || 'Failed to update quota.' }, { status: 500 });
    }
}
