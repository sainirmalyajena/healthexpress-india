import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';

export async function POST(req: Request) {
    const session = await getAdminSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const updated = await prisma.seoOpportunity.update({
            where: { id },
            data: { status }
        });

        // Also create a changelog entry if approved
        if (status === 'APPROVED') {
            await prisma.seoChangeLog.create({
                data: {
                    opportunityId: updated.id,
                    query: updated.query,
                    recommendation: updated.recommendation || 'Sent to content team for implementation',
                    approvedBy: session.email,
                    deploymentDate: new Date(),
                }
            });
        }

        return NextResponse.json({ success: true, updated });
    } catch (e) {
        console.error('SEO Update Error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
