import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const start = performance.now();
        const [leadsCount, doctorsCount, hospitalsCount, usersCount] = await Promise.all([
            prisma.lead.count(),
            prisma.doctor.count(),
            prisma.hospital.count(),
            prisma.user.count()
        ]);
        const latencyMs = Math.round(performance.now() - start);

        return NextResponse.json({
            success: true,
            status: 'Healthy',
            latencyMs,
            pooler: 'aws-0-ap-northeast-1 (Supabase/PostgreSQL)',
            counts: {
                leads: leadsCount,
                doctors: doctorsCount,
                hospitals: hospitalsCount,
                teamMembers: usersCount
            },
            timestamp: new Date().toISOString()
        });
    } catch (err: any) {
        console.error('DB test error:', err);
        return NextResponse.json({ error: err.message || 'Database connection error' }, { status: 500 });
    }
}
