import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getResendClient } from '@/lib/resend';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const targetEmail = body.email || session.email;
        const providedKey = body.apiKey?.trim();

        if (!targetEmail) {
            return NextResponse.json({ error: 'Recipient email is required.' }, { status: 400 });
        }

        // Get Resend client (using provided key, DB saved key, or process.env)
        const client = await getResendClient(providedKey);

        const fromEmail = process.env.EMAIL_FROM || 'HealthExpress <onboarding@resend.dev>';

        const response = await client.emails.send({
            from: fromEmail,
            to: targetEmail,
            subject: '✅ HealthExpress CRM: Test Email Gateway Verification',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <div style="background-color: #0d9488; color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="margin: 0; font-size: 20px;">HealthExpress India CRM</h2>
                        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Email Gateway Delivery Test</p>
                    </div>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                        Hello <strong>${session.name || 'Admin'}</strong>,
                    </p>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                        This confirms that your <strong>Resend Email Gateway</strong> is active and delivering patient booking confirmations and counselor alerts in real time!
                    </p>
                    <div style="background-color: #f8fafc; border-left: 4px solid #0d9488; padding: 12px 16px; margin: 16px 0; font-size: 13px; color: #475569;">
                        <strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST<br/>
                        <strong>Recipient:</strong> ${targetEmail}<br/>
                        <strong>Sender:</strong> ${fromEmail}
                    </div>
                    <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
                        HealthExpress India • Surgical Care Simplified
                    </p>
                </div>
            `
        });

        if (response.error) {
            const errorMsg = response.error.message || 'Resend delivery failed';
            return NextResponse.json({
                error: errorMsg.toLowerCase().includes('api key')
                    ? 'Resend API key is invalid or expired. Please paste your valid key from resend.com/api-keys below.'
                    : errorMsg
            }, { status: 400 });
        }

        // If a new key was provided and succeeded, persist it to database!
        if (providedKey) {
            await prisma.systemSetting.upsert({
                where: { key: 'RESEND_API_KEY' },
                update: { value: providedKey },
                create: { key: 'RESEND_API_KEY', value: providedKey }
            }).catch(console.error);
        }

        return NextResponse.json({
            success: true,
            message: `Test email successfully delivered to ${targetEmail}!`,
            emailId: response.data?.id,
            keySaved: Boolean(providedKey)
        });
    } catch (err: any) {
        console.error('Test email error:', err);
        return NextResponse.json({ error: err.message || 'Failed to dispatch email' }, { status: 500 });
    }
}
