import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.adminId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        // Verify current password if user has an existing password
        if (user.passwordHash && currentPassword) {
            const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!isValid) {
                return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
            }
        }

        const newHash = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newHash }
        });

        return NextResponse.json({ success: true, message: 'Password updated successfully!' });
    } catch (err: any) {
        console.error('Password update error:', err);
        return NextResponse.json({ error: err.message || 'Failed to update password.' }, { status: 500 });
    }
}
