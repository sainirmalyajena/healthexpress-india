import { ShieldCheck, Eye, Clock, CheckCircle } from 'lucide-react';
import CataractCampaignForm from '@/components/campaign/CataractCampaignForm';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Painless Cataract Surgery | 100% Cashless | HealthExpress India',
    description: 'Get advanced Micro-Incision (Phaco) Cataract surgery with premium imported lenses. Book a free consultation and check your insurance coverage.',
};

export default async function CataractCampaignPage({
    searchParams
}: {
    searchParams: Promise<{ city?: string }>
}) {
    const { city } = await searchParams;
    
    // Capitalize the first letter of the city if provided
    const formattedCity = city ? city.charAt(0).toUpperCase() + city.slice(1) : null;
    const locationText = formattedCity ? `${formattedCity}'s` : "India's";

    return (
        <div className="bg-[#0b1c31] min-h-screen">
            {/* Hero Section */}
            <div className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-[-10%] w-[50%] h-[70%] bg-blue-500/20 blur-[100px] rounded-full" />
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        
                        {/* Copywriting Side */}
                        <div className="text-white">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-blue-300 text-xs font-black uppercase tracking-widest mb-6">
                                <Eye className="w-4 h-4" />
                                Senior Citizen Special
                            </div>
                            
                            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-[1.1] font-outfit tracking-tighter">
                                Clear Vision with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Painless Cataract Surgery.</span>
                            </h1>
                            
                            <p className="text-xl text-blue-50/80 mb-10 max-w-lg leading-relaxed">
                                Get rid of cloudy vision. Experience advanced Micro-Incision (Phaco) Cataract Surgery by {locationText} top eye surgeons with premium imported lenses.
                            </p>
                            
                            <div className="space-y-4 mb-10">
                                {[
                                    '100% Cashless Insurance Approval Available',
                                    'Free Cab Pick & Drop for Senior Citizens',
                                    'Painless, Stitchless 20-Min Procedure',
                                    'Premium Indian & Imported Lenses (Zeiss, Alcon)'
                                ].map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                                        <span className="text-blue-50 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md">
                                <ShieldCheck className="w-10 h-10 text-gold-500" />
                                <div>
                                    <p className="text-xs text-blue-50/60 uppercase tracking-widest font-black">Trusted By</p>
                                    <p className="text-lg font-bold text-white">10,000+ Happy Patients</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="lg:pl-12">
                            <CataractCampaignForm />
                        </div>
                        
                    </div>
                </div>
            </div>

            {/* Social Proof / Features Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Fast Recovery</h4>
                            <p className="text-slate-500 text-sm">Discharge on the same day. Resume normal activities within 24-48 hours after the procedure.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Eye className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Advanced Lenses (IOLs)</h4>
                            <p className="text-slate-500 text-sm">Choose from Monofocal, Multifocal, or Toric lenses to eliminate the need for glasses.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Zero Hidden Costs</h4>
                            <p className="text-slate-500 text-sm">Transparent pricing for lenses and surgery. Cashless facilities available for all major insurances.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
