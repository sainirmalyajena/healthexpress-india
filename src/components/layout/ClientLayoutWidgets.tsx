'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const StickyMobileCTA = dynamic(() => import("@/components/layout/StickyMobileCTA"), {
  ssr: false,
});

const MedBot = dynamic(() => import("@/components/ui/MedBot").then(m => m.MedBot), {
  ssr: false,
});

const WhatsAppButton = dynamic(() => import("@/components/ui/WhatsAppButton").then(m => m.WhatsAppButton), {
  ssr: false,
});

const DemoVoiceAgent = dynamic(() => import("@/components/ui/DemoVoiceAgent"), {
  ssr: false,
});

export interface StickyCtaDict {
    call: string;
    book: string;
}

export function ClientLayoutWidgets({ lang, dict }: { lang: string; dict: StickyCtaDict }) {
    const pathname = usePathname();
    const [showDeferredWidgets, setShowDeferredWidgets] = useState(false);

    // Defer heavy widgets (MedBot, WhatsApp) by 5 seconds to avoid blocking hydration
    useEffect(() => {
        const timer = setTimeout(() => setShowDeferredWidgets(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    // Hide sticky widgets on campaign landing pages
    if (pathname?.includes('/campaign/')) {
        return null;
    }

    return (
        <>
            <StickyMobileCTA lang={lang} dict={dict} />
            {showDeferredWidgets && (
                <>
                    <WhatsAppButton />
                    {/* Render voice agent only on root domains if needed, or everywhere */}
                    <DemoVoiceAgent />
                </>
            )}
        </>
    );
}
