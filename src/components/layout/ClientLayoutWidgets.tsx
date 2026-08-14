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



export interface StickyCtaDict {
    call: string;
    book: string;
}

export function ClientLayoutWidgets({ lang, dict }: { lang: string; dict: StickyCtaDict }) {
    const pathname = usePathname();
    const [showDeferredWidgets, setShowDeferredWidgets] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            setShowDeferredWidgets(true);
            // Clean up event listeners after first interaction
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };

        // Fallback: If no interaction within 7 seconds, load anyway
        const timer = setTimeout(() => {
            handleInteraction();
        }, 7000);

        window.addEventListener('scroll', handleInteraction, { passive: true });
        window.addEventListener('mousemove', handleInteraction, { passive: true });
        window.addEventListener('touchstart', handleInteraction, { passive: true });
        window.addEventListener('keydown', handleInteraction, { passive: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    // Hide sticky widgets on campaign landing pages
    if (pathname?.includes('/campaign/')) {
        return null;
    }

    return (
        <>
            <StickyMobileCTA lang={lang} dict={dict} />
            {/* Any deferred widgets can go here later */}
        </>
    );
}
