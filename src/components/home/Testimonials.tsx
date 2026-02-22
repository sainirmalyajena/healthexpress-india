'use client';

interface TestimonialsProps {
    lang: string;
    dict: any;
}

export default function Testimonials({ lang, dict }: TestimonialsProps) {
    const testimonials = [
        {
            name: dict.test1_name,
            location: dict.test1_location,
            text: dict.test1_text,
            initial: 'R'
        },
        {
            name: dict.test2_name,
            location: dict.test2_location,
            text: dict.test2_text,
            initial: 'A'
        },
        {
            name: dict.test3_name,
            location: dict.test3_location,
            text: dict.test3_text,
            initial: 'V'
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        {dict.title}
                    </h2>
                    <div className="w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, i) => (
                        <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                            <div>
                                <div className="flex text-yellow-400 mb-3">
                                    {[...Array(5)].map((_, j) => <span key={j}>★</span>)}
                                </div>
                                <p className="text-slate-700 text-sm mb-4 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-700">{testimonial.initial}</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{testimonial.name}</p>
                                    <p className="text-xs text-slate-500">{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
