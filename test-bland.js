const fetch = require('node-fetch');

async function testCall() {
    const prompt = `
You are Sarah, a professional and empathetic medical receptionist at HealthExpress India. 
You are calling Sai regarding their inquiry for an OPD appointment for General Surgery.
Your goal is to successfully book an appointment date for them. 

Follow these steps strictly:
1. Greet them warmly and state you are calling from HealthExpress India.
2. Ask if they are still looking to book an OPD appointment.
3. If yes, suggest a date (e.g., "Would tomorrow or the day after work better for you?").
4. Once they agree to a specific date or time, tell them the appointment is successfully booked.
5. Confirm the booking was successful and say goodbye politely.

Rules:
- Be very polite and professional.
- Do not make up medical advice.
- Keep your sentences short and natural.
    `;

    const response = await fetch('https://api.bland.ai/v1/calls', {
        method: 'POST',
        headers: {
            'authorization': 'org_b53b3d20e0c840cb758db1b2845e4a37864f799c64c37b73a6f7b225a226a8f7c27748fb6e0f4d016cab69',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone_number: '+919114324795',
            task: prompt,
            voice: 'maya',
            language: 'en-US',
            record: true,
        })
    });

    const data = await response.json();
    console.log(data);
}

testCall();
