export async function sendWhatsAppMessage(phone: string, templateName: string, languageCode: string = 'en', components: any[] = []) {
    const accessToken = process.env.WHATSAPP_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
        console.warn('WhatsApp API credentials missing. Message skipped.');
        return false;
    }

    // Format phone number: remove non-digits, ensure country code
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
        formattedPhone = '91' + formattedPhone; // default to India
    }

    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    const payload = {
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'template',
        template: {
            name: templateName,
            language: {
                code: languageCode
            },
            components: components
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('WhatsApp API Error:', data);
            return false;
        }

        console.log(`WhatsApp message sent successfully to ${formattedPhone}`);
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return false;
    }
}

// Helper for Lead Follow up
export async function sendLeadFollowUp(phone: string, patientName: string, surgeryName: string) {
    // We assume a template named "lead_followup_welcome" exists in WhatsApp Business Manager
    // with 2 variables in the body: {{1}} for Name, {{2}} for Surgery.
    const components = [
        {
            type: "body",
            parameters: [
                {
                    type: "text",
                    text: patientName.split(' ')[0] || "Patient" // First name
                },
                {
                    type: "text",
                    text: surgeryName
                }
            ]
        }
    ];

    return sendWhatsAppMessage(phone, "lead_followup_welcome", "en", components);
}
