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

export function DoctorCard({ doctor, lang, dict }: { doctor: DoctorProps; lang: string; dict: any }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row">
                <div className="sm:w-32 h-32 sm:h-auto relative bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
                            <p className="text-sm text-teal-600 font-medium">{doctor.qualification}</p>
                        </div>
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                            {doctor.experience}+ {dict.years_exp}
                        </span>
                    </div>

                    <div className="mt-2 text-sm text-slate-600 line-clamp-2">
                        {doctor.about}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                            <p className="font-semibold text-slate-700">{doctor.hospital.name}</p>
                            <p>{doctor.hospital.city}</p>
                        </div>
                        <Link
                            href={`/${lang}/doctors/${doctor.id}`}
                            className="text-sm font-medium text-white bg-teal-600 px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            {dict.view_profile}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
