'use client';

import { GoogleAnalytics, sendGAEvent } from '@next/third-parties/google';

export default function Analytics() {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID; // This is the AW- ID

    if (!GA_ID) {
        return null;
    }

    return (
        <>
            <GoogleAnalytics gaId={GA_ID} />
            {GTM_ID && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('config', '${GTM_ID}');
                        `,
                    }}
                />
            )}
        </>
    );
}

// Helper function to track events
export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
    sendGAEvent({ event: eventName, value: eventParams });
};

// Track form submissions
export const trackFormSubmission = (formName: string, surgeryName?: string) => {
    sendGAEvent({
        event: 'form_submission',
        value: {
            form_name: formName,
            surgery_name: surgeryName,
        }
    });
};

// Track phone clicks
export const trackPhoneClick = (phoneNumber: string) => {
    sendGAEvent({
        event: 'phone_click',
        value: {
            phone_number: phoneNumber
        }
    });
};

// Track WhatsApp clicks
export const trackWhatsAppClick = () => {
    sendGAEvent({ event: 'whatsapp_click' });
};
