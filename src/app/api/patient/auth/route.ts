import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
    generateOTP,
    sendOTP
} from '@/lib/patient-auth';
import { signIn, signOut } from '@/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, phone, otp } = body;

        // 1. Send OTP
        if (action === 'send-otp') {
            if (!phone) return NextResponse.json({ error: 'Phone number required' }, { status: 400 });

            const lead = await prisma.lead.findFirst({
                where: { phone: { contains: phone } },
                orderBy: { createdAt: 'desc' }
            });

            if (!lead) {
                return NextResponse.json({ error: 'Phone number not found. Please contact support.' }, { status: 404 });
            }

            const generatedOtp = await generateOTP(phone);
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await prisma.lead.update({
                where: { id: lead.id },
                data: {
                    otp: generatedOtp,
                    otpExpires: expiresAt
                }
            });

            await sendOTP(phone, generatedOtp);

            return NextResponse.json({ success: true, message: 'OTP sent successfully' });
        }

        // 2. Verify OTP & Login via Next-Auth
        if (action === 'verify-otp') {
            if (!phone || !otp) return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 });

            try {
                // Next-Auth handle verification via the provider
                const result = await signIn('patient-login', {
                    phone,
                    otp,
                    redirect: false,
                });

                if (!result) {
                    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
                }

                return NextResponse.json({ success: true });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (authError) {
                return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
            }
        }

        // 3. Logout
        if (action === 'logout') {
            await signOut();
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('Patient Auth Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
