'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, AlertCircle, Activity, Heart, Eye, Brain, Bone } from 'lucide-react';
import { cn } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PainMapper({ lang, dict }: { lang: string; dict: any }) {
    const [activeRegion, setActiveRegion] = useState<string | null>(null);

    const regions = [
        {
            id: 'eyes',
            name: lang === 'hi' ? 'आँख, कान, नाक और गला' : 'Eyes, Ear, Nose & Throat (ENT)',
            icon: Eye,
            top: '15%', left: '50%',
            conditions: ['Blurry Vision', 'Cataracts', 'Sinus Pain', 'Tonsillitis', 'Hearing Loss'],
            surgeries: [
                { name: 'LASIK Eye Surgery', url: `/${lang}/surgeries/lasik-eye-surgery` },
                { name: 'Cataract Surgery', url: `/${lang}/surgeries/cataract-surgery` },
                { name: 'Rhinoplasty', url: `/${lang}/surgeries/rhinoplasty-nose-job` }
            ]
        },
        {
            id: 'brain',
            name: lang === 'hi' ? 'मस्तिष्क' : 'Brain & Head',
            icon: Brain,
            top: '8%', left: '50%',
            conditions: ['Chronic Headaches', 'Tumors', 'Aneurysms'],
            surgeries: [
                { name: 'Neurosurgery Consultation', url: `/${lang}/doctors?specialty=Neurology` }
            ]
        },
        {
            id: 'heart',
            name: lang === 'hi' ? 'हृदय' : 'Heart & Chest',
            icon: Heart,
            top: '32%', left: '50%',
            conditions: ['Chest Pain', 'Blocked Arteries', 'Valve Issues'],
            surgeries: [
                { name: 'Coronary Artery Bypass', url: `/${lang}/surgeries/coronary-artery-bypass-graft-cabg` },
                { name: 'Heart Valve Replacement', url: `/${lang}/surgeries/heart-valve-replacement` }
            ]
        },
        {
            id: 'abdomen',
            name: lang === 'hi' ? 'पेट' : 'Abdomen & Digestion',
            icon: Activity,
            top: '45%', left: '50%',
            conditions: ['Severe Stomach Pain', 'Hernia', 'Gallstones', 'Appendicitis'],
            surgeries: [
                { name: 'Hernia Repair', url: `/${lang}/surgeries/hernia-repair` },
                { name: 'Gallbladder Removal', url: `/${lang}/surgeries/gallbladder-removal` },
                { name: 'Appendix Removal', url: `/${lang}/surgeries/appendix-removal-appendectomy` }
            ]
        },
        {
            id: 'spine',
            name: lang === 'hi' ? 'रीढ़' : 'Spine & Back',
            icon: Bone,
            top: '38%', left: '50%',
            isBack: true,
            conditions: ['Chronic Back Pain', 'Slipped Disc', 'Spinal Stenosis'],
            surgeries: [
                { name: 'Spinal Fusion Surgery', url: `/${lang}/surgeries/spinal-fusion` },
                { name: 'Discectomy', url: `/${lang}/surgeries/discectomy-microdiscectomy` }
            ]
        },
        {
            id: 'hip',
            name: lang === 'hi' ? 'कूल्हा' : 'Hip & Pelvis',
            icon: Bone,
            top: '55%', left: '50%',
            conditions: ['Hip Joint Pain', 'Osteoarthritis', 'Fractures'],
            surgeries: [
                { name: 'Total Hip Replacement', url: `/${lang}/surgeries/total-hip-replacement` }
            ]
        },
        {
            id: 'knee-left',
            name: lang === 'hi' ? 'घुटना' : 'Knee Joints',
            icon: Bone,
            top: '72%', left: '42%',
            conditions: ['Severe Knee Pain', 'ACL Tear', 'Arthritis'],
            surgeries: [
                { name: 'Total Knee Replacement', url: `/${lang}/surgeries/total-knee-replacement` },
                { name: 'ACL Reconstruction', url: `/${lang}/surgeries/acl-reconstruction` }
            ]
        },
        {
            id: 'knee-right',
            name: lang === 'hi' ? 'घुटना' : 'Knee Joints',
            icon: Bone,
            top: '72%', left: '58%',
            linkedTo: 'knee-left', // Clicking right knee opens left knee data
            conditions: [],
            surgeries: []
        }
    ];

    const activeData = regions.find(r => r.id === activeRegion || r.id === regions.find(x => x.id === activeRegion)?.linkedTo);

    return (
        <div className="w-full max-w-6xl mx-auto bg-slate-50 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row min-h-[700px]">
            {/* Left Side: The Interactive Map */}
            <div className="w-full md:w-1/2 bg-slate-900 relative p-8 flex items-center justify-center min-h-[500px]">
                
                {/* Abstract Human Silhouette */}
                <div className="relative w-[240px] h-[600px] flex justify-center">
                    {/* Head */}
                    <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-16 h-20 bg-slate-700/50 rounded-[40px] border border-slate-600 shadow-inner" />
                    {/* Torso */}
                    <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-28 h-56 bg-slate-700/50 rounded-[50px] border border-slate-600 shadow-inner" />
                    {/* Left Arm */}
                    <div className="absolute top-[25%] left-[10%] w-10 h-52 bg-slate-700/50 rounded-[40px] border border-slate-600 shadow-inner origin-top transform rotate-12" />
                    {/* Right Arm */}
                    <div className="absolute top-[25%] right-[10%] w-10 h-52 bg-slate-700/50 rounded-[40px] border border-slate-600 shadow-inner origin-top transform -rotate-12" />
                    {/* Left Leg */}
                    <div className="absolute top-[58%] left-[25%] w-12 h-64 bg-slate-700/50 rounded-[40px] border border-slate-600 shadow-inner" />
                    {/* Right Leg */}
                    <div className="absolute top-[58%] right-[25%] w-12 h-64 bg-slate-700/50 rounded-[40px] border border-slate-600 shadow-inner" />

                    {/* Hotspots */}
                    {regions.map((region) => (
                        <button
                            key={region.id}
                            onClick={() => setActiveRegion(region.id)}
                            className={cn(
                                "absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-300 z-10 group cursor-pointer",
                                activeRegion === region.id || (activeRegion && regions.find(r => r.id === activeRegion)?.linkedTo === region.id)
                                    ? "bg-teal-500 scale-125 shadow-[0_0_20px_rgba(20,184,166,0.6)]" 
                                    : "bg-white/20 hover:bg-teal-400 hover:scale-110"
                            )}
                            style={{ top: region.top, left: region.left }}
                            aria-label={`Select ${region.name}`}
                        >
                            <span className={cn(
                                "absolute inset-0 rounded-full animate-ping opacity-50",
                                activeRegion === region.id ? "bg-teal-400" : "bg-white/50"
                            )} />
                            <div className="w-3 h-3 bg-white rounded-full relative z-10" />
                            
                            {/* Tooltip on hover */}
                            <div className="absolute left-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none border border-slate-700 shadow-xl">
                                {region.name}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-slate-400 text-xs text-center font-medium bg-slate-800/80 backdrop-blur-sm p-3 rounded-xl border border-slate-700">
                        <AlertCircle className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-teal-400" />
                        {lang === 'hi' ? 'यह टूल केवल जानकारी के लिए है, चिकित्सा निदान नहीं।' : 'Click on the area where you are experiencing discomfort.'}
                    </p>
                </div>
            </div>

            {/* Right Side: Information Panel */}
            <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col relative overflow-hidden">
                {activeData ? (
                    <div className="animate-in slide-in-from-right-8 duration-500 h-full flex flex-col">
                        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                            <activeData.icon className="w-8 h-8" />
                        </div>
                        
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                            {activeData.name}
                        </h2>
                        <p className="text-slate-500 font-medium mb-8">
                            {lang === 'hi' ? 'सामान्य स्थितियां और अनुशंसित उपचार:' : 'Common conditions and recommended procedures for this area:'}
                        </p>

                        <div className="space-y-8 flex-1">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">
                                    {lang === 'hi' ? 'सामान्य लक्षण' : 'Common Symptoms'}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {activeData.conditions.map((cond, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                            {cond}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">
                                    {lang === 'hi' ? 'संभावित उपचार' : 'Possible Treatments'}
                                </h3>
                                <div className="space-y-3">
                                    {activeData.surgeries.map((surg, i) => (
                                        <Link 
                                            key={i} 
                                            href={surg.url}
                                            className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all"
                                        >
                                            <span className="font-bold text-slate-800 group-hover:text-teal-700">{surg.name}</span>
                                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <Link 
                                href={`/${lang}/contact`}
                                className="block w-full py-4 bg-slate-900 text-white text-center font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                            >
                                {lang === 'hi' ? 'विशेषज्ञ से सलाह लें' : 'Consult a Specialist'}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                        <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
                            <Activity className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 mb-2">
                            {lang === 'hi' ? 'शरीर के किसी अंग का चयन करें' : 'Select a Body Region'}
                        </h3>
                        <p className="text-slate-400 max-w-xs">
                            {lang === 'hi' ? 'संबंधित सर्जरी और उपचार देखने के लिए आरेख पर क्लिक करें।' : 'Click on the interactive diagram to explore related surgeries and treatments.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
