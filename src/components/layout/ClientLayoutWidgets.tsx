'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const MedBot = dynamic(() => import("@/components/ui/MedBot").then(m => m.MedBot), {
  ssr: false,
});

const WhatsAppButton = dynamic(() => import("@/components/ui/WhatsAppButton").then(m => m.WhatsAppButton), {
  ssr: false,
});

const StickyMobileCTA = dynamic(() => import("@/components/layout").then(m => m.StickyMobileCTA), {
  ssr: false,
});

export interface StickyCtaDict {
    call: string;
    book: string;
}

export function ClientLayoutWidgets({ lang, dict }: { lang: string; dict: StickyCtaDict }) {
    const pathname = usePathname();

    // Hide sticky widgets on campaign landing pages
    if (pathname?.includes('/campaign/')) {
        return null;
    }

    return (
        <>
            <MedBot lang={lang} />
            <WhatsAppButton />
            <StickyMobileCTA lang={lang} dict={dict} />
        </>
    );
}
