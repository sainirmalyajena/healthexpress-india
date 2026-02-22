import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPatientSession } from '@/lib/patient-auth';

// POST — handles both document upload and feedback submission
// Differentiated by `action` field in request body: 'document' | 'feedback'
export async function POST(request: NextRequest) {
    const session = await getPatientSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { action } = body;

        if (action === 'document') {
            const { name, type, data } = body;
            if (!name || !type || !data) {
                return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
            }

            // Upload to Supabase
            const { uploadDocument } = await import('@/lib/supabase');
            const url = await uploadDocument(data, name, type);

            if (!url) {
                return NextResponse.json({ error: 'Failed to upload document to cloud storage' }, { status: 500 });
            }

            const document = await prisma.document.create({
                data: { name, type, url, leadId: session.leadId },
            });
            return NextResponse.json(document);
        }

        if (action === 'feedback') {
            const { rating, feedback } = body;
            if (rating === undefined || rating < 1 || rating > 5) {
                return NextResponse.json({ error: 'Valid rating (1-5) is required' }, { status: 400 });
            }
            const updatedLead = await prisma.lead.update({
                where: { id: session.leadId },
                data: { rating, feedback },
            });
            return NextResponse.json({ success: true, lead: updatedLead });
        }

        return NextResponse.json({ error: 'Invalid action. Use "document" or "feedback".' }, { status: 400 });
    } catch (error) {
        console.error('Patient data error:', error);
        return NextResponse.json({ error: 'Request failed' }, { status: 500 });
    }
}

// GET — fetch documents list for the patient
export async function GET() {
    const session = await getPatientSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const documents = await prisma.document.findMany({
            where: { leadId: session.leadId },
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, type: true, createdAt: true },
        });
        return NextResponse.json(documents);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
    }
}
