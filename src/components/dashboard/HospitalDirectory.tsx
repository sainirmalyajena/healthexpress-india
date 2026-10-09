'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Mail, Phone, Calendar, User } from 'lucide-react';
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
    doctors: { name: string; about: string | null }[];
    leads: Lead[];
}

export default function HospitalDirectory({ hospitals }: { hospitals: HospitalData[] }) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            {hospitals.map(hospital => {
                const totalLeads = hospital.leads.length;
                const opdsBooked = hospital.leads.filter(l => ['OPD_SCHEDULED', 'OPD_DONE', 'SURGERY_SUGGESTED', 'SURGERY_SCHEDULED', 'SURGERY_DONE'].includes(l.status)).length;
                const surgeries = hospital.leads.filter(l => ['SURGERY_DONE'].includes(l.status)).length;
                
                const isExpanded = expandedId === hospital.id;

                const opdPatients = hospital.leads.filter(l => ['OPD_SCHEDULED', 'OPD_DONE', 'SURGERY_SUGGESTED', 'SURGERY_SCHEDULED', 'SURGERY_DONE'].includes(l.status));

                return (
                    <div key={hospital.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:border-slate-300">
                        {/* Card Header (Always visible, clickable) */}
                        <div 
                            onClick={() => setExpandedId(isExpanded ? null : hospital.id)}
                            className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white"
                        >
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900">{hospital.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{hospital.city}</span>
                                    {hospital.email && (
                                        <>
                                            <span className="text-slate-300 mx-1">•</span>
                                            <Mail className="w-4 h-4" />
                                            <span>{hospital.email}</span>
                                        </>
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
                                {/* Details Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {hospital.address && (
                                        <div className="text-sm bg-white p-4 rounded-xl border border-slate-200">
                                            <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400"/> Full Address</p>
                                            <p className="text-slate-600 whitespace-pre-wrap">{hospital.address}</p>
                                            {hospital.googleMapsUrl && (
                                                <a href={hospital.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-medium mt-3 inline-block text-xs">
                                                    View on Google Maps →
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {hospital.doctors && hospital.doctors.length > 0 && (
                                        <div className="text-sm bg-white p-4 rounded-xl border border-slate-200">
                                            <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2"><User className="w-4 h-4 text-slate-400"/> Primary Contact / Doctor</p>
                                            <p className="text-slate-800 font-bold">{hospital.doctors[0].name}</p>
                                            {hospital.doctors[0].about && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{hospital.doctors[0].about}</p>}
                                        </div>
                                    )}
                                </div>

                                {/* OPD Patients Nested Table */}
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
                                                                    {patient.opdDate ? new Date(patient.opdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : <span className="text-slate-400 italic">Not scheduled</span>}
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
    );
}
