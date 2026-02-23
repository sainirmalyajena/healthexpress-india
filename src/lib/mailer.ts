import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import LeadConfirmationEmail from '@/emails/LeadConfirmation';
import AdminNotificationEmail from '@/emails/AdminNotification';
import * as React from 'react';

// Configure Zoho SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.ZOHO_SERVER || 'smtp.zoho.in',
    port: Number(process.env.ZOHO_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.ZOHO_USER,
        pass: process.env.ZOHO_PASS,
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
    // Fallback if SMTP not configured
    if (!process.env.ZOHO_PASS) {
        console.log('--- MOCK EMAIL (Zoho Credentials Missing) ---');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text}`);
        console.log('-------------------------------------------');
        return { id: 'mock-id' };
    }

    try {
        const html = await render(react);

        const info = await transporter.sendMail({
            from: process.env.ZOHO_SENDER || 'HealthExpress India <healthexpressindia@healthexpressindia.com>',
            to,
            subject,
            text,
            html,
        });

        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email via Zoho SMTP:', error);
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
