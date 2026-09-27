import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import LeadConfirmationEmail from '@/emails/LeadConfirmation';
import AdminNotificationEmail from '@/emails/AdminNotification';
import * as React from 'react';

// Configure SMTP transporter (Titan Mail / GoDaddy)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER || 'smtp.titan.email',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail({
    to,
    subject,
    react,
    text,
}: {
    to: string;
    subject: string;
    react: React.ReactElement;
    text: string;
}) {
    // Fallback to Resend Gateway if SMTP credentials not configured
    if (!process.env.SMTP_PASS) {
        try {
            const { getResendClient } = await import('./resend');
            const resendClient = await getResendClient();
            const html = await render(react);
            const fromEmail = process.env.EMAIL_FROM || 'HealthExpress India <onboarding@resend.dev>';
            const res = await resendClient.emails.send({
                from: fromEmail,
                to,
                subject,
                text,
                html,
            });
            return res;
        } catch (resendErr) {
            console.error('Error sending email via Resend gateway:', resendErr);
            return { id: 'mock-id' };
        }
    }

    try {
        const html = await render(react);

        const info = await transporter.sendMail({
            from: process.env.SMTP_SENDER || 'HealthExpress India <sai@healthexpressindia.com>',
            to,
            subject,
            text,
            html,
        });

        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email via SMTP:', error);
        throw error;
    }
}

export const emailTemplates = {
    leadConfirmation: (patientName: string, referenceId: string, surgeryName: string) => ({
        subject: `Your HealthExpress Inquiry Received - ${referenceId}`,
        text: `Hi ${patientName}, Thank you for choosing HealthExpress India. We have received your inquiry for ${surgeryName}. Reference ID: ${referenceId}.`,
        react: React.createElement(LeadConfirmationEmail, {
            patientName,
            referenceId,
            surgeryName,
        }),
    }),
    adminInquiry: (details: {
        referenceId: string;
        fullName: string;
        phone: string;
        email?: string;
        city: string;
        surgeryName: string;
        sourcePage: string;
    }) => ({
        subject: `🚨 NEW LEAD: ${details.surgeryName} - ${details.fullName}`,
        text: `New Lead: ${details.fullName} (${details.phone}) for ${details.surgeryName}. Ref: ${details.referenceId}`,
        react: React.createElement(AdminNotificationEmail, details),
    }),
};
