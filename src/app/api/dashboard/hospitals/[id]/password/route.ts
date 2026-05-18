import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await props.params;
    const { password } = await request.json();

    if (!password || password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    try {
        const hospital = await prisma.hospital.findUnique({
            where: { id }
        });

        if (!hospital) {
            return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.hospital.update({
            where: { id },
            data: { passwordHash }
        });

        return NextResponse.json({
            success: true,
            message: 'Hospital password updated successfully'
        });
    } catch (error) {
        console.error('Error setting hospital password:', error);
        return NextResponse.json({ error: 'Failed to set password' }, { status: 500 });
    }
}
