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

        const doctor = await prisma.doctor.findUnique({
            where: { id }
        });

        if (!doctor) {
            return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }

        // Disconnect relations and delete
        await prisma.doctor.update({
            where: { id },
            data: {
                surgeries: { set: [] }
            }
        });

        await prisma.doctor.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: `${doctor.name} removed from CRM successfully!`
        });
    } catch (err: any) {
        console.error('Error deleting doctor:', err);
        return NextResponse.json({ error: err.message || 'Failed to delete doctor' }, { status: 500 });
    }
}
