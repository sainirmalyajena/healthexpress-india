'use client';

import Script from 'next/script';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export default function Analytics() {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

    if (!GA_ID) {
        return null;
    }

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_ID}', {
                            page_path: window.location.pathname,
                        });
                        ${GTM_ID ? `gtag('config', '${GTM_ID}');` : ''}
                    `,
                }}
            />
        </>
    );
}

// Helper function to track events
export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, eventParams);
    }
};

// Track form submissions
export const trackFormSubmission = (formName: string, surgeryName?: string) => {
    trackEvent('form_submission', {
        form_name: formName,
        surgery_name: surgeryName,
    });
};

// Track phone clicks
export const trackPhoneClick = (phoneNumber: string) => {
    trackEvent('phone_click', {
        phone_number: phoneNumber
    });
};

// Track WhatsApp clicks
export const trackWhatsAppClick = () => {
    trackEvent('whatsapp_click');
};
