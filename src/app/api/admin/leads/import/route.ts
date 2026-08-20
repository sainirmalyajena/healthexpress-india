import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';
import { LeadStatus } from '@/generated/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { leads, assignedUserId } = body;

        if (!Array.isArray(leads)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        let importedCount = 0;

        for (const row of leads) {
            if (!row.fullName || !row.phone) continue;

            await prisma.lead.create({
                data: {
                    fullName: row.fullName,
                    phone: String(row.phone),
                    email: row.email || null,
                    city: row.city || 'Unknown',
                    description: row.description || 'Imported from CSV',
                    status: LeadStatus.NEW,
                    sourcePage: 'CSV Import',
                    referenceId: 'CSV-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
                    assignedUserId: assignedUserId || null,
                }
            });
            importedCount++;
        }

        return NextResponse.json({ success: true, count: importedCount });
    } catch (error: any) {
        console.error('CSV Import Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
