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
                status: 'NEW'
            }
        });

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
