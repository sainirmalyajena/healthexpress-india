import { Quote } from 'lucide-react';

interface TestimonialsProps {
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: any;
}

const surgeryBadgeColors = [
    'bg-teal-50 text-teal-700',
    'bg-violet-50 text-violet-700',
    'bg-blue-50 text-blue-700',
];

const surgeryTypes = ['Knee Replacement', 'Laparoscopy', 'Cataract Surgery'];

export default function Testimonials({ lang, dict }: TestimonialsProps) {
    const testimonials = [
        { name: dict.test1_name, location: dict.test1_location, text: dict.test1_text, initial: 'R', rating: 5 },
        { name: dict.test2_name, location: dict.test2_location, text: dict.test2_text, initial: 'A', rating: 5 },
        { name: dict.test3_name, location: dict.test3_location, text: dict.test3_text, initial: 'V', rating: 5 },
    ];

    return (
        <section className="py-20 md:py-24 bg-white relative overflow-hidden border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-5 h-5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                        <span className="text-slate-600 text-sm font-medium ml-1">4.9/5 from 2,000+ patients</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">{dict.title}</h2>
                    <div className="w-16 h-1 bg-teal-500 mx-auto rounded-full" />
                </div>

                {/* Testimonial cards */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {testimonials.map((testimonial, i) => (
                        <div
                            key={i}
                            className="relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm transition-shadow hover:shadow-lg"
                        >
                            {/* Quote icon */}
                            <div className="absolute top-8 right-8 text-slate-100">
                                <Quote className="w-8 h-8 fill-current" />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, j) => (
                                    <svg key={j} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Surgery badge */}
                            <div className="mb-6">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border border-current ${surgeryBadgeColors[i]}`}>
                                    {surgeryTypes[i]}
                                </span>
                            </div>

                            {/* Quote */}
                            <p className="text-slate-700 leading-relaxed mb-8 text-sm md:text-base relative z-10">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-sm">
                                    {testimonial.initial}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{testimonial.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {testimonial.location}
                                    </p>
                                </div>
                                <div className="ml-auto flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verified
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
