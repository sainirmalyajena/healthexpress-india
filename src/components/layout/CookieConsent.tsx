'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent({ lang }: { lang: string }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('dpdp_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('dpdp_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:w-80 bg-slate-900 text-white p-4 md:p-5 rounded-2xl z-50 border border-slate-700 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom-5">
            <div className="text-xs md:text-sm text-slate-300 leading-relaxed">
                <p>
                    {lang === 'hi'
                        ? 'हम अनुभव बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं। '
                        : 'We use cookies to improve your experience. '}
                    {lang === 'hi'
                        ? <>जारी रखकर, आप <Link href={`/${lang}/privacy`} className="text-teal-400 hover:text-teal-300 underline font-semibold">गोपनीयता नीति</Link> स्वीकार करते हैं।</>
                        : <>By continuing, you agree to our <Link href={`/${lang}/privacy`} className="text-teal-400 hover:text-teal-300 underline font-semibold">Privacy Policy</Link>.</>
                    }
                </p>
            </div>
            <button
                onClick={acceptCookies}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
            >
                {lang === 'hi' ? 'स्वीकार करें' : 'Accept All'}
            </button>
        </div>
    );
}
