'use client';

import dynamic from 'next/dynamic';

const MedBot = dynamic(() => import("@/components/ui/MedBot").then(m => m.MedBot), {
  ssr: false,
});

const WhatsAppButton = dynamic(() => import("@/components/ui/WhatsAppButton").then(m => m.WhatsAppButton), {
  ssr: false,
});

const StickyMobileCTA = dynamic(() => import("@/components/layout").then(m => m.StickyMobileCTA), {
  ssr: false,
});

export function ClientLayoutWidgets({ lang, dict }: { lang: string; dict: any }) {
    return (
        <>
            <MedBot lang={lang} />
            <WhatsAppButton />
            <StickyMobileCTA lang={lang} dict={dict} />
        </>
    );
}
