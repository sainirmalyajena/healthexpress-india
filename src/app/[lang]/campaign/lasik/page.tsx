import Image from 'next/image';
import { ShieldCheck, Eye, Clock, CheckCircle } from 'lucide-react';
import LasikCampaignForm from '@/components/campaign/LasikCampaignForm';

export default function LasikCampaignPage() {
    return (
        <div className="bg-[#051c18] min-h-screen">
            {/* Hero Section */}
            <div className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-[-10%] w-[50%] h-[70%] bg-teal-500/20 blur-[100px] rounded-full" />
                </div>
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        
                        {/* Copywriting Side */}
                        <div className="text-white">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-teal-300 text-xs font-black uppercase tracking-widest mb-6">
                                <Eye className="w-4 h-4" />
                                Day Care Procedure
                            </div>
                            
                            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-[1.1] font-outfit tracking-tighter">
                                Get 6/6 Vision in <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">15 Minutes.</span>
                            </h1>
                            
                            <p className="text-xl text-teal-50/80 mb-10 max-w-lg leading-relaxed">
                                Say goodbye to glasses forever. Experience painless, bladeless LASIK by India's top ophthalmologists.
                            </p>
                            
                            <div className="space-y-4 mb-10">
                                {[
                                    '100% Cashless Insurance Approval Available',
                                    'Free Cab Pick & Drop on Surgery Day',
                                    'Painless Day Care Procedure (Go home same day)',
                                    'Performed at Premium NABH Accredited Hospitals'
                                ].map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-teal-400 flex-shrink-0" />
                                        <span className="text-teal-50 font-medium">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 max-w-md">
                                <ShieldCheck className="w-10 h-10 text-gold-500" />
                                <div>
                                    <p className="text-xs text-teal-50/60 uppercase tracking-widest font-black">Trusted By</p>
                                    <p className="text-lg font-bold text-white">10,000+ Happy Patients</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="lg:pl-12">
                            <LasikCampaignForm />
                        </div>
                        
                    </div>
                </div>
            </div>

            {/* Social Proof / Doctor Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-6 h-6 text-teal-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Fast Recovery</h4>
                            <p className="text-slate-500 text-sm">Resume normal activities within 24-48 hours after the procedure.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Eye className="w-6 h-6 text-teal-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Bladeless Tech</h4>
                            <p className="text-slate-500 text-sm">We use advanced Femto LASIK and Contoura Vision for maximum precision.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-6 h-6 text-teal-600" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Zero Hidden Costs</h4>
                            <p className="text-slate-500 text-sm">Transparent pricing. Check insurance coverage before you commit.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
