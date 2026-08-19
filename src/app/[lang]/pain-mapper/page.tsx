import { Metadata } from 'next';
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { PainMapper } from '@/components/interactive/PainMapper';
import { ShieldAlert } from 'lucide-react';

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'hi' ? 'इंटरएक्टिव पेन मैपर | HealthExpress India' : 'Interactive Pain Mapper | HealthExpress India',
        description: lang === 'hi' ? 'हमारे इंटरएक्टिव बॉडी मैपर के साथ अपने लक्षणों के आधार पर सही सर्जरी खोजें।' : 'Discover the right surgery based on your symptoms with our interactive body mapper.',
    };
}

export default async function PainMapperPage({ params }: PageProps) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang as Locale);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-20 pb-32 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
                
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-teal-500/30">
                        {lang === 'hi' ? 'लक्षण खोजकर्ता' : 'Symptom Discovery'}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        {lang === 'hi' ? 'इंटरएक्टिव पेन मैपर' : 'Interactive Pain Mapper'}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 font-medium">
                        {lang === 'hi' ? 'यह जानने के लिए कि आपको कौन सी सर्जरी या विशेषज्ञ की आवश्यकता हो सकती है, उस क्षेत्र का चयन करें जहां आपको परेशानी हो रही है।' : 'Select the area where you are experiencing discomfort to discover which surgery or specialist you may need.'}
                    </p>
                </div>
            </div>

            {/* The Tool */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                <PainMapper lang={lang} dict={dictionary} />
            </div>

            {/* Medical Disclaimer Section */}
            <div className="max-w-4xl mx-auto px-4 mt-16 text-center">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 inline-block text-left shadow-sm">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-amber-900 mb-2">
                                {lang === 'hi' ? 'महत्वपूर्ण चिकित्सा सूचना' : 'Important Medical Disclaimer'}
                            </h3>
                            <p className="text-amber-800 text-sm leading-relaxed">
                                {lang === 'hi' 
                                    ? 'यह टूल केवल सूचनात्मक उद्देश्यों के लिए डिज़ाइन किया गया है और यह पेशेवर चिकित्सा निदान, सलाह या उपचार का विकल्प नहीं है। किसी भी स्वास्थ्य स्थिति या सर्जरी के बारे में प्रश्नों के लिए हमेशा एक योग्य स्वास्थ्य सेवा प्रदाता की सलाह लें।' 
                                    : 'This tool is designed for informational purposes only and is not a substitute for professional medical diagnosis, advice, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition or surgery.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
