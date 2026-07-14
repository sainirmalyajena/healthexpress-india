'use client';

import Script from 'next/script';

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
    }
}

export default function Analytics() {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
    const FB_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

    if (!GA_ID && !FB_ID) {
        return null;
    }

    return (
        <>
            {GA_ID && (
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
            )}
            
            {FB_ID && (
                <Script
                    id="fb-pixel"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '${FB_ID}');
                            fbq('track', 'PageView');
                        `,
                    }}
                />
            )}
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
