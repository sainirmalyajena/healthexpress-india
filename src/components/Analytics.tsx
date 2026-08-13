'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
    }
}

export default function Analytics() {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-HJ1V4B9QQQ';
    const FB_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '2647191662345776';

    return (
        <>
            {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
            
            <Script
                id="google-ads"
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=AW-16966558904`}
            />
            <Script
                id="google-ads-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'AW-16966558904');
                    `,
                }}
            />

            {FB_ID && (
                <Script
                    id="fb-pixel"
                    strategy="lazyOnload"
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
