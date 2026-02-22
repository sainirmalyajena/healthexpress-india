import { NextRequest, NextResponse } from 'next/server';
import { getPartnerSession } from '@/lib/partner-auth';
import { prisma } from '@/lib/prisma';
import { LeadStatus } from '@/generated/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getPartnerSession();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status, hospitalNotes } = await request.json();

    try {
        const lead = await prisma.lead.findUnique({
            where: { id }
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Verify that this hospital is assigned to the lead
        if (lead.hospitalId !== session.hospitalId) {
            return NextResponse.json({ error: 'Forbidden: Lead not assigned to this hospital' }, { status: 403 });
        }

        const updateData: any = {};
        if (status) updateData.status = status as LeadStatus;

        // We might want to add a specific field for hospital-side notes in the schema
        // For now, let's just append to the general notes or handle it specifically
        // Looking at schema.prisma, we only have 'notes: String?' (internal for ops team)
        // Let's use the 'notes' field but clearly mark it or just allow partners to append
        if (hospitalNotes) {
            const timestamp = new Date().toLocaleString();
            const newNote = `\n[${session.name} - ${timestamp}]: ${hospitalNotes}`;
            updateData.notes = (lead.notes || '') + newNote;
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            lead: updatedLead
        });
    } catch (error) {
        console.error('Partner Lead Update Error:', error);
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}

// POST /api/partner/leads/[id] — upload a document for this lead
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getPartnerSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
        const body = await request.json();
        const { name, type, data } = body;

        if (!name || !type || !data) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const lead = await prisma.lead.findUnique({ where: { id } });
        if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        if (lead.hospitalId !== session.hospitalId) {
            return NextResponse.json({ error: 'Forbidden: Lead not assigned to this hospital' }, { status: 403 });
        }

        // Upload to Supabase
        const { uploadDocument } = await import('@/lib/supabase');
        const url = await uploadDocument(data, name, type);

        if (!url) {
            return NextResponse.json({ error: 'Failed to upload document to cloud storage' }, { status: 500 });
        }

        const document = await prisma.document.create({ data: { name, type, url, leadId: id } });
        return NextResponse.json(document);
    } catch (error) {
        console.error('Partner Document upload error:', error);
        return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
    }
}
