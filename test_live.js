async function testLead() {
    try {
        const response = await fetch('https://healthexpress-india.vercel.app/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: 'AI Test Lead',
                phone: '+919999999999',
                city: 'Test City',
                surgeryId: 'General Consultation',
                description: 'This is an automated test lead to verify the honeypot fix.',
                insurance: 'NO',
                consent: true
            })
        });
        
        const data = await response.text();
        console.log("Status:", response.status);
        console.log("Response:", data);
    } catch (e) {
        console.error("Error:", e);
    }
}
testLead();
