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
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 md:p-6 z-50 border-t border-slate-700 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 max-w-4xl text-sm md:text-base text-slate-300">
                <p>
                    {lang === 'hi'
                        ? 'हम आपकी ब्राउज़िंग अनुभव को बेहतर बनाने, ट्रैफ़िक का विश्लेषण करने और व्यक्तिगत सामग्री प्रदान करने के लिए कुकीज़ का उपयोग करते हैं। '
                        : 'We use cookies to improve your browsing experience, analyze site traffic, and personalize content. '}
                    {lang === 'hi'
                        ? <>हमारी साइट का उपयोग जारी रखकर, आप हमारे <Link href={`/${lang}/privacy`} className="text-teal-400 hover:text-teal-300 underline font-semibold">गोपनीयता नीति</Link> से सहमत हैं।</>
                        : <>By clicking "Accept", you consent to our use of cookies as described in our <Link href={`/${lang}/privacy`} className="text-teal-400 hover:text-teal-300 underline font-semibold">Privacy Policy</Link>.</>
                    }
                </p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <button
                    onClick={acceptCookies}
                    className="flex-1 md:flex-none bg-teal-600 hover:bg-teal-500 text-white px-6 py-2.5 rounded-lg font-bold transition-colors whitespace-nowrap"
                >
                    {lang === 'hi' ? 'स्वीकार करें' : 'Accept All'}
                </button>
            </div>
        </div>
    );
}
