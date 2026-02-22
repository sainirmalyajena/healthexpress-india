import React from 'react';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'hi' ? 'सेवा की शर्तें | HealthExpress' : 'Terms of Service | HealthExpress India',
        description: lang === 'hi' ? 'HealthExpress India की सेवा की शर्तें।' : 'Terms of Service for HealthExpress India.',
    };
}

const TermsEN = () => (
    <>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Service Description</h2>
                <p>
                    HealthExpress India is a medical facilitation and coordination service. We connect patients with hospitals and surgeons.
                    We are <strong>not</strong> a hospital, nor are we medical professionals. We do not provide medical advice, diagnosis, or treatment.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Medical Disclaimer</h2>
                <p>
                    All content on this website is for informational purposes only. Always seek the advice of your physician or other qualified health provider
                    with any questions you may have regarding a medical condition. Reliance on any information provided by HealthExpress India is solely at your own risk.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Eligibility</h2>
                <p>
                    You must be at least 18 years of age to use our services independently. If you are seeking treatment for a minor, you must be the legal guardian.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. User Responsibilities</h2>
                <p>
                    You agree to provide accurate and complete information about your medical history and requirements.
                    You are responsible for verifying the credentials of any medical provider you choose to engage with, although we strive to partner only with accredited institutions.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Limitation of Liability</h2>
                <p>
                    HealthExpress India shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use of our services
                    or from any medical treatment received at partner hospitals. Any medical disputes are strictly between the patient and the hospital/doctor.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Governing Law</h2>
                <p>
                    These terms are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Contact Us</h2>
                <p>
                    For any questions regarding these Terms, please contact us at:<br />
                    <strong>Email:</strong> hello@healthexpress.in
                </p>
            </section>
        </div>
    </>
);

const TermsHI = () => (
    <>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">सेवा की शर्तें</h1>
        <p className="text-slate-500 mb-8">अंतिम अद्यतन: {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. सेवा विवरण</h2>
                <p>
                    HealthExpress India एक चिकित्सा सुविधा और समन्वय सेवा है। हम मरीजों को अस्पतालों और सर्जनों से जोड़ते हैं। हम अस्पताल <strong>नहीं</strong> हैं, और न ही हम चिकित्सा पेशेवर हैं। हम चिकित्सा सलाह, निदान या उपचार प्रदान नहीं करते हैं।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. चिकित्सा अस्वीकरण</h2>
                <p>
                    इस वेबसाइट की सभी सामग्री केवल सूचनात्मक उद्देश्यों के लिए है। चिकित्सा स्थिति के संबंध में आपके किसी भी प्रश्न के लिए हमेशा अपने चिकित्सक या अन्य योग्य स्वास्थ्य प्रदाता की सलाह लें। HealthExpress India द्वारा प्रदान की गई किसी भी जानकारी पर निर्भरता पूरी तरह से आपके अपने जोखिम पर है।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. पात्रता</h2>
                <p>
                    हमारी सेवाओं का स्वतंत्र रूप से उपयोग करने के लिए आपकी आयु कम से कम 18 वर्ष होनी चाहिए। यदि आप किसी नाबालिग के लिए उपचार की तलाश कर रहे हैं, तो आपको कानूनी अभिभावक होना चाहिए।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. उपयोगकर्ता उत्तरदायित्व</h2>
                <p>
                    आप अपने चिकित्सा इतिहास और आवश्यकताओं के बारे में सटीक और पूर्ण जानकारी प्रदान करने के लिए सहमत हैं। आप जिस भी चिकित्सा प्रदाता के साथ जुड़ना चुनते हैं, उसकी साख (credentials) को सत्यापित करने के लिए आप स्वयं जिम्मेदार हैं, हालांकि हम केवल मान्यता प्राप्त संस्थानों के साथ साझेदारी करने का प्रयास करते हैं।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. देयता की सीमा</h2>
                <p>
                    HealthExpress India हमारी सेवाओं के उपयोग से या भागीदार अस्पतालों में प्राप्त किसी भी चिकित्सा उपचार से होने वाले किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक या परिणामी नुकसान के लिए उत्तरदायी नहीं होगा। कोई भी चिकित्सा विवाद सख्ती से मरीज और अस्पताल/डॉक्टर के बीच का विषय है।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. गवर्निंग लॉ</h2>
                <p>
                    ये शर्तें भारत के कानूनों द्वारा शासित होती हैं। इन शर्तों से उत्पन्न होने वाले किसी भी विवाद के लिए मुंबई, महाराष्ट्र की अदालतों का विशेष अधिकार क्षेत्र होगा।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">7. हमसे संपर्क करें</h2>
                <p>
                    इन शर्तों के संबंध में किसी भी प्रश्न के लिए, कृपया हमसे संपर्क करें:<br />
                    <strong>ईमेल:</strong> hello@healthexpress.in
                </p>
            </section>
        </div>
    </>
);

export default async function TermsPage({ params }: PageProps) {
    const { lang } = await params;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
                    {lang === 'hi' ? <TermsHI /> : <TermsEN />}
                </div>
            </div>
        </div>
    );
}
