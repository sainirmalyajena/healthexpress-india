import Link from 'next/link';

interface DoctorProps {
    id: string;
    name: string;
    qualification: string;
    experience: number;
    about: string;
    image: string;
    hospital: {
        name: string;
        city: string;
    };
    specialties?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DoctorCard({ doctor, lang, dict }: { doctor: DoctorProps; lang: string; dict: any }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 relative group">
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-teal-600 opacity-80 group-hover:opacity-100 transition-opacity" />
            
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="pr-4">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-teal-700 transition-colors">{doctor.name}</h3>
                        <p className="text-sm text-teal-600 font-bold mt-1">{doctor.qualification}</p>
                    </div>
                    <div className="bg-teal-50 border border-teal-100 text-teal-700 text-xs px-3 py-1.5 rounded-full font-black whitespace-nowrap shrink-0">
                        {doctor.experience}+ {dict.years_exp}
                    </div>
                </div>

                <div className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                    {doctor.about}
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                        <p className="font-bold text-slate-800 uppercase tracking-wider mb-0.5">{doctor.hospital.name}</p>
                        <p className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {doctor.hospital.city}
                        </p>
                    </div>
                    <Link
                        href={`/${lang}/doctors/${doctor.id}`}
                        className="text-sm font-bold text-teal-700 bg-teal-50 px-5 py-2.5 rounded-xl hover:bg-teal-600 hover:text-white hover:shadow-md transition-all duration-300"
                    >
                        {dict.view_profile}
                    </Link>
                </div>
            </div>
        </div>
    );
}
