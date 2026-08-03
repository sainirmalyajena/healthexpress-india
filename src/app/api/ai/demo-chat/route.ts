import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { sendEmail, emailTemplates } from '@/lib/mailer';

export async function POST(request: Request) {
    try {
        const { message, history } = await request.json();

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are Sarah, a professional and empathetic medical receptionist at HealthExpress India.
You are talking to a patient over the phone.
Your goal is to book an OPD appointment for them.

Follow these rules STRICTLY:
1. Speak in short, conversational sentences as if you are on a voice call.
2. You must collect their FULL NAME, PHONE NUMBER, and PREFERRED DATE/TIME for the appointment.
3. If they just say "yes" to booking, politely ask for their name and phone number first. Do not book until you have all 3 pieces of information.
4. Once you have their Name, Phone Number, and Date/Time, YOU MUST output EXACTLY this special code block at the very end of your message to trigger the booking system:
[BOOKING_TRIGGER: <FullName> | <PhoneNumber> | <DateAndTime>]
Example: "Great, John! I have booked your appointment for tomorrow at 10 AM. [BOOKING_TRIGGER: John Doe | 9876543210 | tomorrow at 10 AM]"
5. Be polite and helpful.

Here is the conversation history:
${history.map((h: any) => `${h.role}: ${h.text}`).join('\n')}
Patient: ${message}
Sarah:`;

        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();

        // Check for booking trigger with piping format
        const bookingMatch = aiResponse.match(/\[BOOKING_TRIGGER:\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\]/);
        let booked = false;

        if (bookingMatch) {
            const patientName = bookingMatch[1].trim();
            const patientPhone = bookingMatch[2].trim();
            const dateStr = bookingMatch[3].trim();
            
            // Remove the trigger from the spoken text
            aiResponse = aiResponse.replace(/\[BOOKING_TRIGGER:.*?\]/, '').trim();
            
            let appointmentDate = new Date();
            if (dateStr.toLowerCase().includes('tomorrow')) {
                appointmentDate.setDate(appointmentDate.getDate() + 1);
            }

            // Save to database
            await prisma.appointment.create({
                data: {
                    patientName: patientName,
                    patientPhone: patientPhone,
                    appointmentDate: appointmentDate,
                    reason: \`Voice AI Booking for \${dateStr}\`,
                    status: 'SCHEDULED'
                }
            });
            booked = true;

            // Send Admin Email
            const adminEmail = process.env.ADMIN_EMAIL || 'info@healthexpressindia.com';
            try {
                await sendEmail({
                    to: adminEmail,
                    ...emailTemplates.adminInquiry({
                        referenceId: \`AI-\${Date.now().toString().slice(-6)}\`,
                        fullName: patientName,
                        phone: patientPhone,
                        city: 'Unknown (Voice Agent)',
                        surgeryName: 'OPD Consultation',
                        sourcePage: 'AI Voice Demo',
                    }),
                });
            } catch (e) {
                console.error("Failed to send admin email on AI booking", e);
            }
        }

        return NextResponse.json({
            text: aiResponse,
            booked: booked
        });

    } catch (error: any) {
        console.error('Demo Chat Error:', error);
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
