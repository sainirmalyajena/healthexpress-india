import React from 'react';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    const isHi = lang === 'hi';
    return {
        title: isHi ? 'नियम और शर्तें | Prism Healthcure' : 'Terms of Service | Prism Healthcure',
        description: isHi ? 'Prism Healthcure के नियम और शर्तें।' : 'Terms of Service for Prism Healthcure Ophthalmology Care.',
    };
}

const TermsEN = () => (
    <>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-8 font-medium">Effective Date: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">1. Services Provided</h2>
                <p>
                    Prism Healthcure provides medical coordination and concierge services for ophthalmology patients. 
                    We are not a medical provider ourselves, but we facilitate access to registered surgeons and accredited hospitals.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">2. No Medical Advice</h2>
                <p>
                    The content on our website is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. 
                    Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">3. Accuracy of Information</h2>
                <p>
                    While we strive for accuracy, surgery cost estimates and hospital availability are subject to change based on 
                    actual clinical evaluation and hospital policy at the time of admission.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">4. Limitation of Liability</h2>
                <p>
                    Prism Healthcure is not liable for any clinical outcomes or medical complications arising from treatments performed 
                    at our partner hospitals. Patients enter into a direct relationship with the medical provider.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">5. Governing Law</h2>
                <p>
                    These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi.
                </p>
            </section>
        </div>
    </>
);

const TermsHI = () => (
    <>
        <h1 className="text-3xl font-black text-slate-900 mb-2">नियम और शर्तें</h1>
        <p className="text-slate-500 mb-8 font-medium">प्रभावी तिथि: {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">1. प्रदान की जाने वाली सेवाएं</h2>
                <p>
                    Prism Healthcure नेत्र विज्ञान के रोगियों के लिए चिकित्सा समन्वय और द्वारपाल सेवाएं प्रदान करता है। हम स्वयं चिकित्सा प्रदाता नहीं हैं।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">2. कोई चिकित्सा सलाह नहीं</h2>
                <p>
                    हमारी वेबसाइट पर मौजूद सामग्री केवल सूचनात्मक उद्देश्यों के लिए है और चिकित्सा सलाह नहीं है।
                </p>
            </section>
        </div>
    </>
);

export default async function PrismTermsPage({ params }: PageProps) {
    const { lang } = await params;

    return (
        <div className="min-h-screen bg-slate-50 py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-5">
                <div className="bg-white rounded-[2rem] shadow-premium p-8 md:p-16 border border-slate-100">
                    {lang === 'hi' ? <TermsHI /> : <TermsEN />}
                </div>
            </div>
        </div>
    );
}
