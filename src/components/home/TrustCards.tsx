import { Building2, ShieldCheck, UserCheck, Car } from 'lucide-react';

interface TrustCardsProps {
    lang: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dict: any;
}

export default function TrustCards({ dict }: TrustCardsProps) {
    const stats = [
        {
            icon: Building2,
            value: '500+',
            label: dict.hospital_title,
            desc: dict.hospital_desc,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            icon: ShieldCheck,
            value: '₹0',
            label: dict.insurance_title,
            desc: dict.insurance_desc,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
        },
        {
            icon: UserCheck,
            value: '10K+',
            label: dict.care_title,
            desc: dict.care_desc,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
        {
            icon: Car,
            value: '100%',
            label: dict.cab_title,
            desc: dict.cab_desc,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        }
    ];

    return (
        <section className="py-10 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="group flex items-center gap-4 p-4 md:p-5 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} strokeWidth={2} />
                            </div>
                            <div>
                                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                                <p className="text-sm font-bold text-slate-800 leading-tight">{stat.label}</p>
                                <p className="text-xs text-slate-400 font-medium leading-tight hidden md:block">{stat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
