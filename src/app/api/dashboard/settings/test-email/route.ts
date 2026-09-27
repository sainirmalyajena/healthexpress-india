import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { resend } from '@/lib/resend';

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const targetEmail = body.email || session.email;

        if (!targetEmail) {
            return NextResponse.json({ error: 'Recipient email is required.' }, { status: 400 });
        }

        const fromEmail = process.env.EMAIL_FROM || 'HealthExpress <onboarding@resend.dev>';

        const response = await resend.emails.send({
            from: fromEmail,
            to: targetEmail,
            subject: '✅ HealthExpress CRM: Test Email Gateway Verification',
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px;">
                    <div style="background-color: #0d9488; color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="margin: 0; font-size: 20px;">HealthExpress India CRM</h2>
                        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Email Gateway Delivery Test</p>
                    </div>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                        Hello <strong>${session.name || 'Admin'}</strong>,
                    </p>
                    <p style="color: #334155; font-size: 15px; line-height: 1.6;">
                        This is a live test notification from your <strong>HealthExpress CRM Settings & Integrations Center</strong>. Your Resend API gateway is functioning normally!
                    </p>
                    <div style="background-color: #f8fafc; border-left: 4px solid #0d9488; padding: 12px 16px; margin: 16px 0; font-size: 13px; color: #475569;">
                        <strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST<br/>
                        <strong>Recipient:</strong> ${targetEmail}<br/>
                        <strong>Sender:</strong> ${fromEmail}
                    </div>
                    <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
                        This email confirms that transactional emails for patient booking confirmations, doctor assignment alerts, and partner onboarding are delivered seamlessly.
                    </p>
                </div>
            `
        });

        if (response.error) {
            return NextResponse.json({ error: response.error.message || 'Resend delivery failed' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Test email successfully sent to ${targetEmail}!`,
            emailId: response.data?.id
        });
    } catch (err: any) {
        console.error('Test email error:', err);
        return NextResponse.json({ error: err.message || 'Failed to dispatch email' }, { status: 500 });
    }
}
