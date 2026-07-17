import { Building2, ShieldCheck, UserCheck, Car } from 'lucide-react';

interface TrustCardsProps {
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: any;
}

export default function TrustCards({ dict }: TrustCardsProps) {
    const cards = [
        {
            icon: Building2,
            title: dict.hospital_title,
            desc: dict.hospital_desc,
            color: 'from-blue-400 to-blue-600',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
        },
        {
            icon: ShieldCheck,
            title: dict.insurance_title,
            desc: dict.insurance_desc,
            color: 'from-teal-400 to-teal-600',
            bg: 'bg-teal-50',
            text: 'text-teal-600',
        },
        {
            icon: UserCheck,
            title: dict.care_title,
            desc: dict.care_desc,
            color: 'from-indigo-400 to-indigo-600',
            bg: 'bg-indigo-50',
            text: 'text-indigo-600',
        },
        {
            icon: Car,
            title: dict.cab_title,
            desc: dict.cab_desc,
            color: 'from-amber-400 to-amber-600',
            bg: 'bg-amber-50',
            text: 'text-amber-600',
        }
    ];

    return (
        <section className="py-12 md:py-20 bg-white relative z-20 -mt-8 md:-mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, i) => (
                        <div 
                            key={i} 
                            className="group bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <card.icon className={`w-7 h-7 ${card.text}`} strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed font-medium">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
