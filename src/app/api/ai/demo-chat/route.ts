import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

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
2. If they haven't given a date/time yet, politely ask them when they would like to come in.
3. If they give a date or time, YOU MUST output EXACTLY this special code block at the very end of your message to trigger the booking system:
[BOOKING_TRIGGER: <date>]
Example: "Great, I have booked your appointment for tomorrow! [BOOKING_TRIGGER: tomorrow]"
4. Be polite and helpful.

Here is the conversation history:
${history.map((h: any) => `${h.role}: ${h.text}`).join('\n')}
Patient: ${message}
Sarah:`;

        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();

        // Check for booking trigger
        const bookingMatch = aiResponse.match(/\[BOOKING_TRIGGER:\s*(.+?)\]/);
        let booked = false;

        if (bookingMatch) {
            const dateStr = bookingMatch[1];
            // Remove the trigger from the spoken text
            aiResponse = aiResponse.replace(/\[BOOKING_TRIGGER:\s*(.+?)\]/, '').trim();
            
            let appointmentDate = new Date();
            if (dateStr.toLowerCase().includes('tomorrow')) {
                appointmentDate.setDate(appointmentDate.getDate() + 1);
            }

            // Save to database
            await prisma.appointment.create({
                data: {
                    patientName: 'Demo Patient',
                    patientPhone: '0000000000',
                    appointmentDate: appointmentDate,
                    reason: 'Demo Consultation from Voice Agent',
                    status: 'SCHEDULED'
                }
            });
            booked = true;
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
