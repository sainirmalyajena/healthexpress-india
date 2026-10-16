'use client';

import { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp, MapPin, Mail, Phone, Calendar, User, Search, Navigation, Loader2, X } from 'lucide-react';
import { getStatusColor } from '@/lib/utils';

interface Lead {
    id: string;
    fullName: string;
    phone: string;
    opdDate: Date | null;
    status: string;
}

interface HospitalData {
    id: string;
    name: string;
    city: string | null;
    address: string | null;
    googleMapsUrl: string | null;
    email: string | null;
    pincode: string | null;
    latitude: number | null;
    longitude: number | null;
    doctors: { name: string; about: string | null }[];
    leads: Lead[];
}

type DistanceMap = Record<string, number | null>;

export default function HospitalDirectory({ hospitals }: { hospitals: HospitalData[] }) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pincode, setPincode] = useState('');
    const [distances, setDistances] = useState<DistanceMap>({});
    const [distanceError, setDistanceError] = useState('');
    const [loadingDistance, setLoadingDistance] = useState(false);
    const [distanceCalculated, setDistanceCalculated] = useState(false);

    // Filter hospitals by search query (name, city, address)
    const filteredHospitals = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return hospitals;
        return hospitals.filter(h =>
            h.name.toLowerCase().includes(q) ||
            (h.city ?? '').toLowerCase().includes(q) ||
            (h.address ?? '').toLowerCase().includes(q)
        );
    }, [hospitals, searchQuery]);

    // Sort by distance when available
    const sortedHospitals = useMemo(() => {
        if (!distanceCalculated || Object.keys(distances).length === 0) return filteredHospitals;
        return [...filteredHospitals].sort((a, b) => {
            const da = distances[a.id];
            const db = distances[b.id];
            if (da == null && db == null) return 0;
            if (da == null) return 1;
            if (db == null) return -1;
            return da - db;
        });
    }, [filteredHospitals, distances, distanceCalculated]);

    const handleDistanceSearch = useCallback(async () => {
        if (!/^\d{6}$/.test(pincode.trim())) {
            setDistanceError('Please enter a valid 6-digit pincode.');
            return;
        }
        setLoadingDistance(true);
        setDistanceError('');
        setDistanceCalculated(false);
        try {
            const res = await fetch(`/api/dashboard/hospitals/distance?pincode=${pincode.trim()}`);
            const data = await res.json();
            if (!res.ok) {
                setDistanceError(data.error || 'Something went wrong.');
            } else {
                setDistances(data.distances);
                setDistanceCalculated(true);
            }
        } catch {
            setDistanceError('Network error. Please try again.');
        } finally {
            setLoadingDistance(false);
        }
    }, [pincode]);

    const clearDistance = () => {
        setPincode('');
        setDistances({});
        setDistanceCalculated(false);
        setDistanceError('');
    };

    return (
        <div className="space-y-6">
            {/* ── Search + Distance Bar ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* City / Name Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by hospital name or city…"
                            className="w-full pl-9 pr-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-slate-400 transition"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Pincode Distance */}
                    <div className="flex gap-2 items-start flex-col sm:flex-row">
                        <div className="relative">
                            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500 pointer-events-none" />
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={pincode}
                                onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setDistanceError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handleDistanceSearch()}
                                placeholder="Patient pincode (6 digits)"
                                className="pl-9 pr-4 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder:text-slate-400 transition w-full sm:w-52"
                            />
                        </div>
                        <button
                            onClick={handleDistanceSearch}
                            disabled={loadingDistance || pincode.length !== 6}
                            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
                        >
                            {loadingDistance
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Calculating…</>
                                : <><Navigation className="w-4 h-4" /> Show Distance</>
                            }
                        </button>
                        {distanceCalculated && (
                            <button onClick={clearDistance} className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition">
                                <X className="w-4 h-4" /> Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Error or success hint */}
                {distanceError && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5" /> {distanceError}
                    </p>
                )}
                {distanceCalculated && (
                    <p className="mt-2 text-sm text-teal-600 font-medium flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5" />
                        Showing distances from pincode <strong>{pincode}</strong> — sorted nearest first
                    </p>
                )}
            </div>

            {/* ── Results count ── */}
            {searchQuery && (
                <p className="text-sm text-slate-500 px-1">
                    {sortedHospitals.length === 0
                        ? `No hospitals found for "${searchQuery}"`
                        : `${sortedHospitals.length} hospital${sortedHospitals.length > 1 ? 's' : ''} found for "${searchQuery}"`
                    }
                </p>
            )}

            {/* ── Hospital Cards ── */}
            {sortedHospitals.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
                    <span className="text-4xl mb-4 block">🏥</span>
                    <p className="text-slate-500 font-medium">No hospitals found.</p>
                    <p className="text-sm text-slate-400 mt-1">Try a different search term.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sortedHospitals.map(hospital => {
                        const totalLeads = hospital.leads.length;
                        const opdsBooked = hospital.leads.filter(l => ['OPD_SCHEDULED', 'OPD_DONE', 'SURGERY_SUGGESTED', 'SURGERY_SCHEDULED', 'SURGERY_DONE'].includes(l.status)).length;
                        const surgeries = hospital.leads.filter(l => ['SURGERY_DONE'].includes(l.status)).length;
                        const isExpanded = expandedId === hospital.id;
                        const opdPatients = hospital.leads.filter(l => ['OPD_SCHEDULED', 'OPD_DONE', 'SURGERY_SUGGESTED', 'SURGERY_SCHEDULED', 'SURGERY_DONE'].includes(l.status));
                        const distKm = distances[hospital.id];

                        return (
                            <div key={hospital.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:border-slate-300">
                                {/* Card Header */}
                                <div
                                    onClick={() => setExpandedId(isExpanded ? null : hospital.id)}
                                    className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-lg font-bold text-slate-900">{hospital.name}</h3>
                                            {distanceCalculated && (
                                                distKm != null
                                                    ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold rounded-full whitespace-nowrap">
                                                        <Navigation className="w-3 h-3" /> ~{distKm} km
                                                      </span>
                                                    : <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-400 text-xs font-semibold rounded-full whitespace-nowrap">
                                                        Distance N/A
                                                      </span>
                                            )}
                                        </div>
                                        <div className="flex items-start sm:items-center gap-2 text-sm text-slate-500 mt-2 flex-col sm:flex-row">
                                            <div className="flex items-center gap-1.5 line-clamp-1">
                                                <MapPin className="w-4 h-4 shrink-0" />
                                                <span>{hospital.address ? `${hospital.address}, ${hospital.city}` : hospital.city}</span>
                                            </div>
                                            {hospital.email && (
                                                <div className="flex items-center gap-1.5 mt-1 sm:mt-0">
                                                    <span className="text-slate-300 mx-1 hidden sm:inline">•</span>
                                                    <Mail className="w-4 h-4 shrink-0" />
                                                    <span>{hospital.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="flex flex-col items-center px-4 py-1.5 bg-slate-50 rounded-lg border border-slate-100 min-w-[90px]">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Leads</span>
                                            <span className="text-lg font-black text-slate-700">{totalLeads}</span>
                                        </div>
                                        <div className="flex flex-col items-center px-4 py-1.5 bg-amber-50 rounded-lg border border-amber-100 min-w-[90px]">
                                            <span className="text-[10px] font-bold text-amber-500 uppercase">OPDs Booked</span>
                                            <span className="text-lg font-black text-amber-700">{opdsBooked}</span>
                                        </div>
                                        <div className="flex flex-col items-center px-4 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 min-w-[90px]">
                                            <span className="text-[10px] font-bold text-emerald-500 uppercase">Surgeries</span>
                                            <span className="text-lg font-black text-emerald-700">{surgeries}</span>
                                        </div>
                                        <div className="ml-2 text-slate-400">
                                            {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="border-t border-slate-100 bg-slate-50 p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {hospital.address && (
                                                <div className="text-sm bg-white p-4 rounded-xl border border-slate-200">
                                                    <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> Full Address</p>
                                                    <p className="text-slate-600 whitespace-pre-wrap">{hospital.address}</p>
                                                    {hospital.googleMapsUrl && (
                                                        <a href={hospital.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-medium mt-3 inline-block text-xs">
                                                            View on Google Maps →
                                                        </a>
                                                    )}
                                                    {hospital.pincode && (
                                                        <p className="text-slate-400 text-xs mt-1">📮 Pincode: {hospital.pincode}</p>
                                                    )}
                                                </div>
                                            )}
                                            {hospital.doctors && hospital.doctors.length > 0 && (
                                                <div className="text-sm bg-white p-4 rounded-xl border border-slate-200">
                                                    <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> Primary Contact / Doctor</p>
                                                    <p className="text-slate-800 font-bold">{hospital.doctors[0].name}</p>
                                                    {hospital.doctors[0].about && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{hospital.doctors[0].about}</p>}
                                                </div>
                                            )}
                                        </div>

                                        {/* OPD Patients Table */}
                                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                            <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-slate-700">OPD Patients Directory</h4>
                                                <span className="text-xs font-semibold bg-white px-2 py-1 rounded text-slate-500 border border-slate-200">{opdPatients.length} Patients</span>
                                            </div>
                                            {opdPatients.length === 0 ? (
                                                <div className="p-8 text-center text-slate-400 text-sm">
                                                    No patients have booked OPDs here yet.
                                                </div>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left text-sm">
                                                        <thead className="bg-white border-b border-slate-100">
                                                            <tr>
                                                                <th className="px-5 py-3 font-bold text-slate-400 text-xs uppercase tracking-wider">Patient Name</th>
                                                                <th className="px-5 py-3 font-bold text-slate-400 text-xs uppercase tracking-wider">Contact</th>
                                                                <th className="px-5 py-3 font-bold text-slate-400 text-xs uppercase tracking-wider">Appointment Date</th>
                                                                <th className="px-5 py-3 font-bold text-slate-400 text-xs uppercase tracking-wider">Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-50">
                                                            {opdPatients.map((patient) => (
                                                                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors">
                                                                    <td className="px-5 py-3 font-semibold text-slate-800">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                                                <User className="w-3 h-3" />
                                                                            </div>
                                                                            {patient.fullName}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-5 py-3 text-slate-600">
                                                                        <div className="flex items-center gap-2">
                                                                            <Phone className="w-3 h-3 text-slate-400" />
                                                                            <span className="font-medium text-slate-700">{patient.phone}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-5 py-3 text-slate-600">
                                                                        <div className="flex items-center gap-2">
                                                                            <Calendar className="w-4 h-4 text-slate-400" />
                                                                            {patient.opdDate
                                                                                ? new Date(patient.opdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                                                : <span className="text-slate-400 italic">Not scheduled</span>
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-5 py-3">
                                                                        <span className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full ${getStatusColor(patient.status)}`}>
                                                                            {patient.status.replace(/_/g, ' ')}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
