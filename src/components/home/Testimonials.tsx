'use client';

import { Quote } from 'lucide-react';

interface TestimonialsProps {
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: any;
}

const surgeryBadgeColors = [
    'bg-teal-100 text-teal-700',
    'bg-violet-100 text-violet-700',
    'bg-blue-100 text-blue-700',
];

const avatarGradients = [
    'from-teal-400 to-emerald-500',
    'from-violet-400 to-purple-500',
    'from-blue-400 to-cyan-500',
];

const surgeryTypes = ['Knee Replacement', 'Laparoscopy', 'Cataract Surgery'];

export default function Testimonials({ lang, dict }: TestimonialsProps) {
    const testimonials = [
        { name: dict.test1_name, location: dict.test1_location, text: dict.test1_text, initial: 'R', rating: 5 },
        { name: dict.test2_name, location: dict.test2_location, text: dict.test2_text, initial: 'A', rating: 5 },
        { name: dict.test3_name, location: dict.test3_location, text: dict.test3_text, initial: 'V', rating: 5 },
    ];

    return (
        <section className="py-20 md:py-32 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.05),_transparent_70%)]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className="text-slate-500 text-sm font-semibold ml-1">4.9/5 from 2,000+ patients</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">{dict.title}</h2>
                    <div className="w-16 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto rounded-full" />
                </div>

                {/* Testimonial cards */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((testimonial, i) => (
                        <div
                            key={i}
                            className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all"
                        >
                            {/* Quote icon */}
                            <div className="absolute top-7 right-7 w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                                <Quote className="w-5 h-5 text-teal-400" />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {[...Array(testimonial.rating)].map((_, j) => (
                                    <svg key={j} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Surgery badge */}
                            <div className="mb-5">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${surgeryBadgeColors[i]}`}>
                                    {surgeryTypes[i]}
                                </span>
                            </div>

                            {/* Quote */}
                            <p className="text-slate-700 leading-relaxed mb-7 text-sm md:text-base">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradients[i]} flex items-center justify-center font-bold text-white text-sm shadow-lg`}>
                                    {testimonial.initial}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <span>📍</span> {testimonial.location}
                                    </p>
                                </div>
                                <div className="ml-auto text-xs text-teal-600 font-bold bg-teal-50 px-3 py-1 rounded-full">
                                    Verified ✓
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom trust strip */}
                <div
                    className="mt-14 text-center"
                >
                    <p className="text-slate-400 text-sm">
                        {lang === 'hi' ? 'Join 10,000+ satisfied patients nationwide' : 'Join 10,000+ satisfied patients nationwide'}
                    </p>
                </div>
            </div>
        </section>
    );
}
