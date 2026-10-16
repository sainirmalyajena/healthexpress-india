'use client';

import { useState, useMemo } from 'react';
import { Search, X, User, Building2, Award, Briefcase } from 'lucide-react';

interface DoctorItem {
    id: string;
    name: string;
    email: string;
    qualification: string;
    experience: number;
    status: string;
    image?: string | null;
    hospital?: {
        id: string;
        name: string;
        city?: string | null;
    } | null;
}

export default function DoctorDirectory({ doctors }: { doctors: DoctorItem[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDoctors = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return doctors;
        return doctors.filter(doc =>
            doc.name.toLowerCase().includes(q) ||
            doc.qualification.toLowerCase().includes(q) ||
            doc.email.toLowerCase().includes(q) ||
            (doc.hospital?.name ?? '').toLowerCase().includes(q) ||
            (doc.hospital?.city ?? '').toLowerCase().includes(q)
        );
    }, [doctors, searchQuery]);

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search doctor by name, hospital, qualification, or city..."
                        className="w-full pl-9 pr-10 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-slate-400 transition"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Results Counter */}
            {searchQuery && (
                <p className="text-sm text-slate-500 px-1">
                    {filteredDoctors.length === 0
                        ? `No doctors found matching "${searchQuery}"`
                        : `${filteredDoctors.length} doctor${filteredDoctors.length > 1 ? 's' : ''} found matching "${searchQuery}"`
                    }
                </p>
            )}

            {/* Doctors Table / Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Doctor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Qualification</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Experience</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Hospital Affiliation</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredDoctors.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-4xl mb-4">👨‍⚕️</span>
                                            <p className="text-slate-500 font-medium">No doctors found.</p>
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="mt-2 text-xs font-semibold text-teal-600 hover:underline"
                                                >
                                                    Clear search query
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredDoctors.map((doctor) => (
                                    <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold shrink-0">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{doctor.name}</p>
                                                    <p className="text-xs text-slate-500">{doctor.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{doctor.qualification}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{doctor.experience} Years</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                                                <span className="font-medium text-slate-800">
                                                    {doctor.hospital?.name || 'Independent'}
                                                </span>
                                                {doctor.hospital?.city && (
                                                    <span className="text-xs text-slate-400">({doctor.hospital.city})</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${doctor.status === 'ACTIVE' ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                {doctor.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
