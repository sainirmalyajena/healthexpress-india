import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.user.update({
            where: { id: session.adminId },
            data: { lastActiveAt: new Date() }
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Heartbeat error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
