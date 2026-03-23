import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { PartnerStatus } from '@/generated/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();

    // Type casting to access custom role property added in auth.ts callbacks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session.user as any)?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const partnerReq = await prisma.partnerRequest.findUnique({
            where: { id }
        });

        if (!partnerReq) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        if (partnerReq.status === PartnerStatus.APPROVED || partnerReq.status === PartnerStatus.ONBOARDED) {
            return NextResponse.json({ error: 'Request already approved' }, { status: 400 });
        }

        // Transaction: Update status and create Hospital record
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update PartnerRequest status
            const updatedReq = await tx.partnerRequest.update({
                where: { id },
                data: { status: PartnerStatus.APPROVED }
            });

            // 2. Create Hospital record
            const hospital = await tx.hospital.create({
                data: {
                    name: partnerReq.hospitalName,
                    city: partnerReq.city,
                    specialties: partnerReq.specialties,
                    discountPercent: 10, // Default 10% discount for new partners
                    email: partnerReq.email,
                    status: 'ACTIVE'
                }
            });

            return { updatedReq, hospital };
        });

        return NextResponse.json({
            success: true,
            message: 'Partner approved and hospital record created',
            hospital: result.hospital
        });
    } catch (error) {
        console.error('Error approving partner:', error);
        return NextResponse.json({ error: 'Failed to approve partner' }, { status: 500 });
    }
}
