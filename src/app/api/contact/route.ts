import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReferenceId } from '@/lib/utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.phone) {
            return NextResponse.json(
                { error: 'Name and phone are required' },
                { status: 400 }
            );
        }

        // Generate reference ID
        const referenceId = generateReferenceId();

        // Build description from form data
        const descriptionParts = [];
        if (body.surgery) descriptionParts.push(`Surgery: ${body.surgery}`);
        if (body.city) descriptionParts.push(`City: ${body.city}`);
        if (body.callbackTime) descriptionParts.push(`Callback: ${body.callbackTime}`);
        if (body.insurance) descriptionParts.push(`Insurance: ${body.insurance}`);

        const description = descriptionParts.length > 0
            ? descriptionParts.join(' | ')
            : 'General inquiry from contact page';

        // Auto-assign to least loaded team counselor via round-robin
        let assignedCounselor = null;
        try {
            assignedCounselor = await prisma.user.findFirst({
                where: { role: 'team' },
                orderBy: { assignedLeads: { _count: 'asc' } },
                select: { id: true, name: true, email: true }
            });
        } catch { /* fallback to unassigned */ }

        // Save to Database without requiring a dummy surgery
        const lead = await prisma.lead.create({
            data: {
                fullName: body.name,
                phone: body.phone,
                email: body.email || null,
                city: body.city || 'Not specified',
                surgeryId: null, // General inquiry
                description,
                sourcePage: '/contact',
                referenceId,
                status: 'NEW',
                assignedUserId: assignedCounselor?.id || null,
            }
        });

        // Automated Email Notifications via Resend
        try {
            const { sendEmail, emailTemplates } = await import('@/lib/mailer');

            if (body.email) {
                const template = emailTemplates.leadConfirmation(body.name, referenceId, 'Medical Consultation');
                await sendEmail({ to: body.email, ...template });
            }

            const adminTemplate = emailTemplates.adminInquiry({
                referenceId,
                fullName: body.name,
                phone: body.phone,
                email: body.email || undefined,
                city: body.city || 'Not specified',
                surgeryName: `General Contact Form${assignedCounselor ? ` [Assigned: ${assignedCounselor.name}]` : ''}`,
                sourcePage: '/contact',
            });

            await sendEmail({
                to: process.env.OPS_EMAIL || 'sai@healthexpressindia.com',
                ...adminTemplate,
            });
        } catch (emailErr) {
            console.error('Contact email alert error:', emailErr);
        }

        console.log('Contact form lead created:', {
            id: lead.id,
            name: lead.fullName,
            referenceId
        });

        return NextResponse.json({
            success: true,
            referenceId,
        });
    } catch (error) {
        console.error('Contact form submission error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        );
    }
}
