import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReferenceId } from '@/lib/utils';
import { resend } from '@/lib/resend';
import { AdminNotificationEmail } from '@/emails/AdminNotification';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.hospitalName || !body.email || !body.phone) {
            return NextResponse.json(
                { error: 'Hospital name, email, and phone are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate specialties
        if (!body.specialties || body.specialties.length === 0) {
            return NextResponse.json(
                { error: 'Please select at least one specialty' },
                { status: 400 }
            );
        }

        // Generate reference ID
        const referenceId = generateReferenceId();

        // Save to Database
        const partnerRequest = await prisma.partnerRequest.create({
            data: {
                // Basic Info
                hospitalName: body.hospitalName,
                registrationNumber: body.registrationNumber || 'N/A',
                city: body.city || 'Unknown',
                state: body.state || 'Unknown',
                pincode: body.pincode || '000000',

                // Contact
                contactPerson: body.contactPerson || 'Unknown',
                designation: body.designation || 'Unknown',
                email: body.email,
                phone: body.phone,
                website: body.website || null,

                // Hospital Details
                hospitalType: body.hospitalType || [],
                specialties: body.specialties,
                bedCapacity: parseInt(body.bedCapacity as string) || 0,
                icuBeds: body.icuBeds ? parseInt(body.icuBeds as string) : null,
                hasOT: body.hasOT || false,
                yearsInOperation: parseInt(body.yearsInOperation as string) || 0,

                // Accreditation
                isNABH: body.isNABH || false,
                isJCI: body.isJCI || false,
                isISO: body.isISO || false,

                // Facilities
                has24x7Emergency: body.has24x7Emergency || false,
                hasAmbulance: body.hasAmbulance || false,
                hasPharmacy: body.hasPharmacy || false,
                hasDiagnosticLab: body.hasDiagnosticLab || false,
                hasBloodBank: body.hasBloodBank || false,

                // Additional
                partnershipReason: body.partnershipReason || 'Not specified',
                monthlyPatients: body.monthlyPatients ? parseInt(body.monthlyPatients as string) : null,
                insuranceTieups: body.insuranceTieups || null,

                // Status
                referenceId,
                status: 'PENDING'
            }
        });

        console.log('Partner request created:', {
            id: partnerRequest.id,
            hospital: partnerRequest.hospitalName,
            referenceId
        });

        // Send notification email to admin using Resend
        try {
            await resend.emails.send({
                from: 'HealthExpress India <onboarding@resend.dev>', // Update with verified domain if available
                to: process.env.OPS_EMAIL || 'ops@healthexpressindia.com',
                subject: `New Partner Application: ${partnerRequest.hospitalName}`,
                react: AdminNotificationEmail({
                    referenceId: partnerRequest.referenceId,
                    fullName: `${partnerRequest.hospitalName} - ${partnerRequest.contactPerson}`,
                    phone: partnerRequest.phone,
                    email: partnerRequest.email,
                    city: partnerRequest.city,
                    surgeryName: "Partner Onboarding Request",
                    sourcePage: "/partners"
                })
            });
        } catch (emailErr) {
            console.error('Email preparation error:', emailErr);
        }

        return NextResponse.json({
            success: true,
            referenceId,
            message: 'Your partnership application has been received successfully!'
        });
    } catch (error) {
        console.error('Partner request submission error:', error);
        return NextResponse.json(
            { error: 'An error occurred while submitting your application. Please try again.' },
            { status: 500 }
        );
    }
}
