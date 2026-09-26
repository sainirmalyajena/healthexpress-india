import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await props.params;

        const hospital = await prisma.hospital.findUnique({
            where: { id }
        });

        if (!hospital) {
            return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
        }

        // Unlink associated leads
        await prisma.lead.updateMany({
            where: { hospitalId: id },
            data: { hospitalId: null }
        });

        // Disconnect doctor surgery relations then delete doctors affiliated with this hospital
        const affiliatedDoctors = await prisma.doctor.findMany({
            where: { hospitalId: id },
            select: { id: true }
        });

        for (const doc of affiliatedDoctors) {
            await prisma.doctor.update({
                where: { id: doc.id },
                data: { surgeries: { set: [] } }
            });
        }

        await prisma.doctor.deleteMany({
            where: { hospitalId: id }
        });

        // Delete the hospital
        await prisma.hospital.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: `${hospital.name} and associated records removed from CRM successfully!`
        });
    } catch (err: any) {
        console.error('Error deleting hospital:', err);
        return NextResponse.json({ error: err.message || 'Failed to delete hospital' }, { status: 500 });
    }
}
