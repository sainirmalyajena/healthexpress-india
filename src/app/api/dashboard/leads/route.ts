import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session?.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { fullName, phone, city, surgeryId, description } = body;

        if (!fullName || !phone || !city) {
            return NextResponse.json({ error: 'Name, phone, and city are required' }, { status: 400 });
        }

        // Generate a reference ID
        const referenceId = `MANUAL-${Date.now().toString(36).toUpperCase()}`;

        let actualSurgeryId = surgeryId;
        if (!actualSurgeryId) {
            const firstSurgery = await prisma.surgery.findFirst();
            if (firstSurgery) actualSurgeryId = firstSurgery.id;
        }

        if (!actualSurgeryId) {
            return NextResponse.json({ error: 'No surgeries exist in the database' }, { status: 400 });
        }

        const newLead = await prisma.lead.create({
            data: {
                fullName,
                phone,
                city,
                description: description || 'Manually added lead',
                surgeryId: actualSurgeryId,
                sourcePage: 'Manual Entry',
                referenceId,
                status: 'NEW',
                assignedUserId: session.userId, // Automatically assign to the creator
            }
        });

        // Log the creation
        await prisma.activityLog.create({
            data: {
                userId: session.userId,
                leadId: newLead.id,
                actionType: 'NOTE_ADDED',
                details: 'Lead manually created by user'
            }
        });

        return NextResponse.json({ success: true, lead: newLead });
    } catch (error: any) {
        console.error('Error creating lead:', error);
        return NextResponse.json({ error: error.message || 'Failed to create lead' }, { status: 500 });
    }
}
