'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent({ lang }: { lang: string }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('dpdp_consent');
        if (!consent) {
            // Small delay so it doesn't clash with page load
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('dpdp_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-16 left-3 right-3 md:bottom-6 md:left-6 md:right-auto md:w-72 bg-slate-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl z-[70] border border-slate-700/50 shadow-xl flex items-center gap-3">
            <p className="text-[11px] text-slate-300 leading-snug flex-1">
                {lang === 'hi'
                    ? <>कुकीज़ उपयोग। <Link href={`/${lang}/privacy`} className="text-teal-400 underline">नीति</Link></>
                    : <>We use cookies. <Link href={`/${lang}/privacy`} className="text-teal-400 underline">Policy</Link></>
                }
            </p>
            <button
                onClick={acceptCookies}
                className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex-shrink-0"
            >
                OK
            </button>
        </div>
    );
}
