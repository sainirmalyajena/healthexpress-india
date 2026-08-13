import React from 'react';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'hi' ? 'गोपनीयता नीति | HealthExpress' : 'Privacy Policy | HealthExpress India',
        description: lang === 'hi' ? 'HealthExpress India की गोपनीयता नीति (DPDP अनुपालन)। जानें कि हम आपके डेटा को कैसे सुरक्षित रखते हैं।' : 'Privacy Policy for HealthExpress India compliant with DPDP Act 2023. Learn how we collect, use, and protect your data.',
    };
}

const PrivacyEN = () => (
    <>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. Overview & DPDP Compliance</h2>
                <p>
                    HealthExpress India acts as a <strong>Data Fiduciary</strong> under the Digital Personal Data Protection (DPDP) Act, 2023. We are committed to processing your digital personal data lawfully, fairly, and transparently. This policy outlines how we collect, use, and protect your personal information when you use our services.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. Notice & Consent</h2>
                <p>We will only process your personal data after providing you with a clear notice and obtaining your explicit, informed consent. We collect information such as:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Name, email address, and phone number.</li>
                    <li>Medical history, symptoms, or surgery requirements (only what you choose to share).</li>
                    <li>Insurance details to assist with coverage verification.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. Purpose Limitation</h2>
                <p>Your data is collected <strong>strictly</strong> for the following purposes:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Connecting you with relevant doctors, surgeons, and hospitals for treatment.</li>
                    <li>Providing cost estimates and facilitating hospital admissions.</li>
                    <li>Communicating with you regarding your inquiry.</li>
                </ul>
                <p className="mt-2 text-sm text-slate-500 italic">We do not sell your personal data to third-party marketers or data brokers.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. Information Sharing</h2>
                <p>
                    To facilitate your treatment, your data may be shared with our verified Data Processors, including partner hospitals and surgeons. All our partners are bound by strict confidentiality and data protection obligations as mandated by the DPDP Act.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. Your Rights as a Data Principal</h2>
                <p>Under the DPDP Act, you have the right to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>Right to Information:</strong> Request a summary of the personal data we process and the identities of all Data Processors we share it with.</li>
                    <li><strong>Right to Correction & Erasure:</strong> Request the correction of inaccurate data or the deletion of your data when it is no longer necessary for the stated purpose.</li>
                    <li><strong>Right to Withdraw Consent:</strong> You may withdraw your consent at any time. However, this may affect our ability to provide medical coordination services.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. Grievance Redressal</h2>
                <p>
                    If you wish to exercise any of your rights or have a grievance regarding your personal data, please contact our Grievance Officer:<br /><br />
                    <strong>Grievance Officer:</strong> HealthExpress India Legal Team<br />
                    <strong>Email:</strong> grievance@healthexpressindia.com<br />
                    <strong>Phone:</strong> +91 93078 61041<br />
                    <strong>Address:</strong> C-120, 2nd Floor, Lajpat Nagar 1, New Delhi - 110024
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
                <h2 className="text-xl font-semibold text-slate-900 mb-3">1. अवलोकन और DPDP अनुपालन</h2>
                <p>
                    HealthExpress India, डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम, 2023 के तहत <strong>डेटा फिड्यूशियरी</strong> के रूप में कार्य करता है। हम आपके डिजिटल व्यक्तिगत डेटा को कानूनी, निष्पक्ष और पारदर्शी रूप से संसाधित करने के लिए प्रतिबद्ध हैं।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">2. सूचना और सहमति</h2>
                <p>हम आपको स्पष्ट सूचना प्रदान करने और आपकी स्पष्ट सहमति प्राप्त करने के बाद ही आपके व्यक्तिगत डेटा को संसाधित करेंगे। हम निम्नलिखित जानकारी एकत्र करते हैं:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>नाम, ईमेल पता और फ़ोन नंबर।</li>
                    <li>चिकित्सा इतिहास, लक्षण, या सर्जरी की आवश्यकताएं (केवल वह जो आप साझा करना चुनते हैं)।</li>
                    <li>कवरेज सत्यापन में सहायता के लिए बीमा विवरण।</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">3. उद्देश्य की सीमा</h2>
                <p>आपका डेटा <strong>सख्ती से</strong> निम्नलिखित उद्देश्यों के लिए एकत्र किया जाता है:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>उपचार के लिए आपको प्रासंगिक डॉक्टरों, सर्जनों और अस्पतालों से जोड़ना।</li>
                    <li>लागत अनुमान प्रदान करना और अस्पताल में प्रवेश की सुविधा प्रदान करना।</li>
                    <li>आपकी पूछताछ के संबंध में आपसे संवाद करना।</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">4. सूचना साझाकरण</h2>
                <p>
                    आपके उपचार की सुविधा के लिए, आपका डेटा हमारे सत्यापित डेटा प्रोसेसर, जिसमें साथी अस्पताल और सर्जन शामिल हैं, के साथ साझा किया जा सकता है।
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">5. डेटा प्रिंसिपल के रूप में आपके अधिकार</h2>
                <p>DPDP अधिनियम के तहत, आपको निम्नलिखित अधिकार प्राप्त हैं:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li><strong>सूचना का अधिकार:</strong> उस व्यक्तिगत डेटा का सारांश मांगना जिसे हम संसाधित करते हैं।</li>
                    <li><strong>सुधार और मिटाने का अधिकार:</strong> गलत डेटा में सुधार या अपने डेटा को हटाने का अनुरोध करना।</li>
                    <li><strong>सहमति वापस लेने का अधिकार:</strong> आप किसी भी समय अपनी सहमति वापस ले सकते हैं।</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-slate-900 mb-3">6. शिकायत निवारण</h2>
                <p>
                    यदि आप अपने किसी भी अधिकार का प्रयोग करना चाहते हैं या अपने व्यक्तिगत डेटा के संबंध में कोई शिकायत है, तो कृपया हमारे शिकायत अधिकारी से संपर्क करें:<br /><br />
                    <strong>शिकायत अधिकारी:</strong> HealthExpress India Legal Team<br />
                    <strong>ईमेल:</strong> grievance@healthexpressindia.com<br />
                    <strong>फ़ोन:</strong> +91 93078 61041<br />
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
