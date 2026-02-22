import React from 'react';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'hi' ? 'गोपनीयता नीति | HealthExpress' : 'Privacy Policy | HealthExpress India',
        description: lang === 'hi' ? 'HealthExpress India की गोपनीयता नीति। जानें कि हम आपके डेटा को कैसे एकत्र, उपयोग और सुरक्षित रखते हैं।' : 'Privacy Policy for HealthExpress India. Learn how we collect, use, and protect your data.',
    };
}

const PrivacyEN = () => (
    <>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Overview</h2>
                <p>
                    At HealthExpress India, we value your privacy and are committed to protecting your personal information.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
                    or use our services to find surgery and hospitalization support.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Information We Collect</h2>
                <p>We may collect personal information that you voluntarily provide to us when you inquire about our services, such as:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Name, email address, and phone number.</li>
                    <li>Medical history, symptoms, or surgery requirements (only what you choose to share).</li>
                    <li>Insurance details to assist with coverage verification.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Connect you with relevant doctors, surgeons, and hospitals.</li>
                    <li>Provide cost estimates and facilitate hospital admissions.</li>
                    <li>Communicate with you regarding your inquiry (via Phone, WhatsApp, or Email).</li>
                    <li>Improve our website and services.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Information Sharing</h2>
                <p>
                    We may share your basic contact and medical details with our partner hospitals and surgeons <strong>only</strong> for the purpose
                    of facilitating your treatment. We do not sell your data to third-party marketers.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Data Security</h2>
                <p>
                    We use administrative, technical, and physical security measures to help protect your personal information.
                    However, please be aware that no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. User Rights</h2>
                <p>
                    You have the right to request access to the personal information we hold about you, request corrections, or request deletion of your data.
                    Keep in mind that deleting your data may affect our ability to assist with your medical coordination.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">7. Contact Us</h2>
                <p>
                    If you have questions or comments about this Privacy Policy, please contact us at:<br />
                    <strong>Email:</strong> hello@healthexpress.in<br />
                    <strong>Phone:</strong> +91 93078 61041
                </p>
            </section>
        </div>
    </>
);

const PrivacyHI = () => (
    <>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">गोपनीयता नीति</h1>
        <p className="text-slate-500 mb-8">अंतिम अद्यतन: {new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. अवलोकन</h2>
                <p>
                    HealthExpress India में, हम आपकी गोपनीयता को महत्व देते हैं और आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए प्रतिबद्ध हैं। यह गोपनीयता नीति बताती है कि जब आप हमारी वेबसाइट पर जाते हैं या सर्जरी और अस्पताल में भर्ती सहायता खोजने के लिए हमारी सेवाओं का उपयोग करते हैं, तो हम आपकी जानकारी को कैसे एकत्र, उपयोग, प्रकट और सुरक्षित रखते हैं।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. जानकारी जो हम एकत्र करते हैं</h2>
                <p>हम व्यक्तिगत जानकारी एकत्र कर सकते हैं जो आप स्वेच्छा से हमें प्रदान करते हैं जब आप हमारी सेवाओं के बारे में पूछताछ करते हैं, जैसे:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>नाम, ईमेल पता और फ़ोन नंबर।</li>
                    <li>चिकित्सा इतिहास, लक्षण, या सर्जरी की आवश्यकताएं (केवल वह जो आप साझा करना चुनते हैं)।</li>
                    <li>कवरेज सत्यापन में सहायता के लिए बीमा विवरण।</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. हम आपकी जानकारी का उपयोग कैसे करते हैं</h2>
                <p>हम एकत्र की गई जानकारी का उपयोग निम्न के लिए करते हैं:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>आपको प्रासंगिक डॉक्टरों, सर्जनों और अस्पतालों से जोड़ना।</li>
                    <li>लागत अनुमान प्रदान करना और अस्पताल में प्रवेश की सुविधा प्रदान करना।</li>
                    <li>आपकी पूछताछ के संबंध में आपसे संवाद करना (फ़ोन, व्हाट्सएप या ईमेल के माध्यम से)।</li>
                    <li>हमारी वेबसाइट और सेवाओं में सुधार करना।</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. सूचना साझाकरण</h2>
                <p>
                    हम आपकी बुनियादी संपर्क और चिकित्सा विवरण हमारे साथी अस्पतालों और सर्जनों के साथ <strong>केवल</strong> आपके उपचार की सुविधा के उद्देश्य से साझा कर सकते हैं। हम आपका डेटा तीसरे पक्ष के विपणक को नहीं बेचते हैं।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. डेटा सुरक्षा</h2>
                <p>
                    हम आपकी व्यक्तिगत जानकारी को सुरक्षित रखने में मदद करने के लिए प्रशासनिक, तकनीकी और भौतिक सुरक्षा उपायों का उपयोग करते हैं। हालांकि, कृपया ध्यान रखें कि इंटरनेट पर कोई भी इलेक्ट्रॉनिक ट्रांसमिशन या सूचना भंडारण तकनीक 100% सुरक्षित होने की गारंटी नहीं दी जा सकती है।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. उपयोगकर्ता अधिकार</h2>
                <p>
                    आपके पास हमारे द्वारा रखी गई व्यक्तिगत जानकारी तक पहुँच का अनुरोध करने, सुधार का अनुरोध करने या अपने डेटा को हटाने का अनुरोध करने का अधिकार है। ध्यान रखें कि आपका डेटा हटाने से हमारी चिकित्सा समन्वय में सहायता करने की क्षमता प्रभावित हो सकती है।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">7. हमसे संपर्क करें</h2>
                <p>
                    यदि आपके पास इस गोपनीयता नीति के बारे में प्रश्न या टिप्पणियां हैं, तो कृपया हमसे संपर्क करें:<br />
                    <strong>ईमेल:</strong> hello@healthexpress.in<br />
                    <strong>फ़ोन:</strong> +91 93078 61041
                </p>
            </section>
        </div>
    </>
);

export default async function PrivacyPage({ params }: PageProps) {
    const { lang } = await params;

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
                    {lang === 'hi' ? <PrivacyHI /> : <PrivacyEN />}
                </div>
            </div>
        </div>
    );
}
