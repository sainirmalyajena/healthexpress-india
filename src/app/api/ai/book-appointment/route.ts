import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Bland AI sends the tool arguments inside the body
        // It also sends the call metadata if we configured it (which we did)
        const dateAgreed = body.date_agreed || new Date().toISOString();
        const callId = body.call_id;
        
        // Extract metadata we sent when triggering the call
        const metadata = body.metadata || {};
        const patientName = metadata.patientName || 'Unknown Patient';
        const patientPhone = metadata.patientPhone || 'Unknown Phone';
        const reason = metadata.reason || 'General OPD';

        // Parse date (very roughly, ideally use a library like dayjs/date-fns)
        let appointmentDate = new Date();
        if (typeof dateAgreed === 'string' && dateAgreed.toLowerCase() === 'tomorrow') {
            appointmentDate.setDate(appointmentDate.getDate() + 1);
        } else if (typeof dateAgreed === 'string' && !isNaN(Date.parse(dateAgreed))) {
            appointmentDate = new Date(dateAgreed);
        }

        // Save to Database
        const appointment = await prisma.appointment.create({
            data: {
                patientName,
                patientPhone,
                appointmentDate,
                reason,
                status: 'SCHEDULED'
            }
        });

        // The response we send back will be read by the AI agent
        // so it knows the booking was successful and can tell the patient.
        return NextResponse.json({
            status: "success",
            message: `Appointment successfully booked for ${appointmentDate.toDateString()}. ID: ${appointment.id}`
        });

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ 
            status: "error", 
            message: 'Failed to book appointment' 
        }, { status: 500 });
    }
}
