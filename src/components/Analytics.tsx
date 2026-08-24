'use client';

import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
        fbq: (...args: unknown[]) => void;
    }
}

function AnalyticsInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const FB_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '2647191662345776';

    useEffect(() => {
        // Track FB Pixel PageView on route change
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'PageView');
        }
        
        // Also send GA config for Google Ads on mount or route change if needed
        // (Though GoogleAnalytics component handles GA4 pageviews automatically)
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('config', 'AW-16966558904');
        }
    }, [pathname, searchParams]);

    return (
        <>
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
                        `,
                    }}
                />
            )}
        </>
    );
}

export default function Analytics() {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-HJ1V4B9QQQ';

    return (
        <>
            {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
            <Suspense fallback={null}>
                <AnalyticsInner />
            </Suspense>
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
