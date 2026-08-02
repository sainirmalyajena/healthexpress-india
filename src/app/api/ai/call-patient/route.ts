import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { patientName, patientPhone, reason } = await request.json();

        if (!patientPhone) {
            return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
        }

        const apiKey = process.env.BLAND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ success: false, message: 'Bland API Key is missing' }, { status: 500 });
        }

        const prompt = `
You are Sarah, a professional and empathetic medical receptionist at HealthExpress India. 
You are calling ${patientName ? patientName : 'a patient'} regarding their inquiry for an OPD appointment for ${reason ? reason : 'a medical consultation'}.
Your goal is to successfully book an appointment date for them. 

Follow these steps strictly:
1. Greet them warmly and state you are calling from HealthExpress India.
2. Ask if they are still looking to book an OPD appointment.
3. If yes, suggest a date (e.g., "Would tomorrow or the day after work better for you?").
4. Once they agree to a specific date or time, you MUST use your "book_appointment" tool to save the appointment.
5. Confirm the booking was successful and say goodbye politely.

Rules:
- Be very polite and professional.
- Do not make up medical advice.
- Keep your sentences short and natural.
        `;

        // Define the webhook tool that the AI can call
        const tools = [
            {
                name: "book_appointment",
                description: "Book an OPD appointment for the patient. Call this ONLY after the patient agrees to a specific date.",
                url: "https://healthexpressindia.com/api/ai/book-appointment",
                method: "POST",
                input_schema: {
                    type: "object",
                    properties: {
                        date_agreed: {
                            type: "string",
                            description: "The date the patient agreed to, in YYYY-MM-DD format if possible, or just the word they said like 'tomorrow'."
                        }
                    },
                    required: ["date_agreed"]
                },
                response_data: [
                    {
                        name: "status",
                        description: "Whether the booking was successful or not"
                    }
                ]
            }
        ];

        const response = await fetch('https://api.bland.ai/v1/calls', {
            method: 'POST',
            headers: {
                'authorization': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone_number: patientPhone,
                task: prompt,
                voice: "maya", // Professional female voice
                language: "en-US",
                record: true,
                tools: tools,
                metadata: {
                    patientName,
                    patientPhone,
                    reason
                }
            })
        });

        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message);
        }

        return NextResponse.json({
            success: true,
            message: 'AI Agent is dialing the patient now...',
            callId: data.call_id
        });

    } catch (error: any) {
        console.error('Bland AI Call Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
