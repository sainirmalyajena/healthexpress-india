import React from 'react';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    const isHi = lang === 'hi';
    return {
        title: isHi ? 'गोपनीयता नीति | Prism Healthcure' : 'Privacy Policy | Prism Healthcure',
        description: isHi ? 'Prism Healthcure की गोपनीयता नीति।' : 'Privacy Policy for Prism Healthcure. Learn how we protect your vision and data.',
    };
}

const PrivacyEN = () => (
    <>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-8 font-medium">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">1. Overview</h2>
                <p>
                    At Prism Healthcure, we are dedicated to protecting your privacy and ensuring the security of your personal information. 
                    This policy details our practices regarding the collection and use of your data when you seek ophthalmology care through our platform.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">2. Data We Collect</h2>
                <p>We collect information necessary to coordinate your eye care, including:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Basic identifiers: Name, Phone Number, and Email.</li>
                    <li>Clinical details: Current eye conditions, desired treatments (e.g., LASIK, Cataract), and medical history.</li>
                    <li>Insurance information for cashless coordination.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">3. Purpose of Collection</h2>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>Facilitating appointments with senior ophthalmologists.</li>
                    <li>Providing personalized treatment guidance and cost estimations.</li>
                    <li>Managing hospital admissions and insurance pre-authorizations.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">4. Information Sharing</h2>
                <p>
                    Your data is shared <strong>exclusively</strong> with our partner clinics and surgeons involved in your treatment. 
                    We do not sell or trade your personal information with external marketing agencies.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">5. Contact Us</h2>
                <p>
                    For privacy concerns, contact our data coordinator:<br />
                    <strong>Email:</strong> contact@prismhealthcure.com<br />
                    <strong>Phone:</strong> +91 93078 61041
                </p>
            </section>
        </div>
    </>
);

const PrivacyHI = () => (
    <>
        <h1 className="text-3xl font-black text-slate-900 mb-2">गोपनीयता नीति</h1>
        <p className="text-slate-500 mb-8 font-medium">अंतिम अद्यतन: {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-slate-600 leading-relaxed">
            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">1. अवलोकन</h2>
                <p>
                    Prism Healthcure में, हम आपकी गोपनीयता की रक्षा करने और आपकी व्यक्तिगत जानकारी की सुरक्षा सुनिश्चित करने के लिए समर्पित हैं।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">2. डेटा जो हम एकत्र करते हैं</h2>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                    <li>मूल पहचानकर्ता: नाम, फ़ोन नंबर और ईमेल।</li>
                    <li>नैदानिक विवरण: वर्तमान आंखों की स्थिति, वांछित उपचार (जैसे, लैसिक, मोतियाबिंद)।</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold text-slate-900 mb-3">3. संपर्क करें</h2>
                <p>
                    <strong>ईमेल:</strong> contact@prismhealthcure.com<br />
                    <strong>फ़ोन:</strong> +91 93078 61041
                </p>
            </section>
        </div>
    </>
);

export default async function PrismPrivacyPage({ params }: PageProps) {
    const { lang } = await params;

    return (
        <div className="min-h-screen bg-slate-50 py-20 md:py-32">
            <div className="max-w-4xl mx-auto px-5">
                <div className="bg-white rounded-[2rem] shadow-premium p-8 md:p-16 border border-slate-100">
                    {lang === 'hi' ? <PrivacyHI /> : <PrivacyEN />}
                </div>
            </div>
        </div>
    );
}
