/**
 * WhatsApp Service (Enterprise Implementation)
 * Handles all outbound WhatsApp communications via Meta Cloud API
 */
export class WhatsAppService {
    private readonly apiUrl = 'https://graph.facebook.com/v17.0';
    private readonly phoneNumberId: string;
    private readonly accessToken: string;

    constructor() {
        this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
        this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    }

    /**
     * Sends the initial "Welcome & Triage" message to a new lead
     */
    async sendInitialLeadWelcome(phone: string, patientName: string, surgeryName: string): Promise<boolean> {
        if (!this.isConfigured()) {
            console.warn('[WhatsAppService] Not configured. Skipping message to:', phone);
            return false;
        }

        const formattedPhone = this.formatPhoneNumber(phone);
        
        try {
            const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: formattedPhone,
                    type: 'template',
                    template: {
                        name: 'new_lead_welcome',
                        language: { code: 'en' },
                        components: [
                            {
                                type: 'body',
                                parameters: [
                                    { type: 'text', text: patientName },
                                    { type: 'text', text: surgeryName || 'medical treatment' }
                                ]
                            }
                        ]
                    }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('[WhatsAppService] Meta API Error:', error);
                return false;
            }

            console.log(`[WhatsAppService] Successfully sent welcome message to ${formattedPhone}`);
            return true;
        } catch (error) {
            console.error('[WhatsAppService] Exception sending message:', error);
            return false;
        }
    }

    private formatPhoneNumber(phone: string): string {
        let cleaned = phone.replace(/[\s\-\(\)]/g, '');
        if (cleaned.length === 10) {
            cleaned = '91' + cleaned;
        }
        return cleaned.replace('+', '');
    }

    private isConfigured(): boolean {
        return Boolean(this.phoneNumberId && this.accessToken);
    }
}

export const whatsappService = new WhatsAppService();
