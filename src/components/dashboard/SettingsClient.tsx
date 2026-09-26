'use client';

import { useState } from 'react';
import { 
    User as UserIcon, 
    Shield, 
    Key, 
    Users, 
    CheckCircle2, 
    AlertCircle, 
    Building, 
    Clock, 
    Save, 
    Phone, 
    Mail, 
    Database, 
    Bot, 
    Sparkles,
    Check,
    Lock,
    Stethoscope,
    Plus,
    Trash2,
    Search,
    X,
    Percent,
    MapPin,
    GraduationCap,
    Award
} from 'lucide-react';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    dailyCallQuota: number;
    lastActiveAt?: string | null;
    assignedLeadsCount: number;
}

interface CurrentUser {
    id: string;
    name: string;
    email: string;
    role: string;
    dailyCallQuota: number;
}

export interface DoctorItem {
    id: string;
    name: string;
    qualification: string;
    experience: number;
    about: string;
    email: string;
    image: string;
    status: string;
    hospitalId: string;
    hospitalName: string;
    hospitalCity: string;
    surgeries: { id: string; name: string }[];
}

export interface HospitalItem {
    id: string;
    name: string;
    city: string;
    specialties: string[];
    discountPercent: number;
    email: string;
    status: string;
    leadsCount: number;
    doctorsCount: number;
}

interface SettingsClientProps {
    currentUser: CurrentUser;
    teamMembers: TeamMember[];
    initialDoctors: DoctorItem[];
    initialHospitals: HospitalItem[];
    availableSurgeries: { id: string; name: string }[];
}

export default function SettingsClient({ 
    currentUser, 
    teamMembers: initialTeam,
    initialDoctors,
    initialHospitals,
    availableSurgeries
}: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'doctors' | 'hospitals' | 'team' | 'integrations' | 'clinic'>('doctors');

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pwdLoading, setPwdLoading] = useState(false);
    const [pwdMessage, setPwdMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Team quota state
    const [team, setTeam] = useState<TeamMember[]>(initialTeam);
    const [quotaLoadingId, setQuotaLoadingId] = useState<string | null>(null);
    const [quotaSuccessId, setQuotaSuccessId] = useState<string | null>(null);
    const [quotaError, setQuotaError] = useState<string | null>(null);

    // Doctors state
    const [doctors, setDoctors] = useState<DoctorItem[]>(initialDoctors);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
    const [doctorSaving, setDoctorSaving] = useState(false);
    const [doctorError, setDoctorError] = useState('');
    const [newDoctor, setNewDoctor] = useState({
        name: '',
        qualification: '',
        experience: 8,
        hospitalId: initialHospitals[0]?.id || '',
        selectedSurgeries: [] as string[],
        email: '',
        about: ''
    });

    // Hospitals state
    const [hospitals, setHospitals] = useState<HospitalItem[]>(initialHospitals);
    const [hospitalSearch, setHospitalSearch] = useState('');
    const [isAddHospitalOpen, setIsAddHospitalOpen] = useState(false);
    const [hospitalSaving, setHospitalSaving] = useState(false);
    const [hospitalError, setHospitalError] = useState('');
    const [newHospital, setNewHospital] = useState({
        name: '',
        city: 'Mumbai',
        specialties: 'Ophthalmology, Laparoscopy, Proctology',
        discountPercent: 10,
        email: ''
    });

    // Deletion modal state
    const [itemToDelete, setItemToDelete] = useState<{
        type: 'doctor' | 'hospital';
        id: string;
        name: string;
    } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteFeedback, setDeleteFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Password submit handler
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwdMessage(null);

        if (newPassword.length < 6) {
            setPwdMessage({ text: 'New password must be at least 6 characters long.', type: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPwdMessage({ text: 'New passwords do not match.', type: 'error' });
            return;
        }

        setPwdLoading(true);
        try {
            const res = await fetch('/api/dashboard/settings/password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                setPwdMessage({ text: data.error || 'Failed to update password.', type: 'error' });
            } else {
                setPwdMessage({ text: 'Password successfully updated!', type: 'success' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch {
            setPwdMessage({ text: 'Network error. Please try again.', type: 'error' });
        } finally {
            setPwdLoading(false);
        }
    };

    // Quota change handler
    const handleQuotaChange = (userId: string, newQuota: number) => {
        setTeam(prev => prev.map(m => m.id === userId ? { ...m, dailyCallQuota: newQuota } : m));
    };

    const saveQuota = async (userId: string, quota: number) => {
        setQuotaLoadingId(userId);
        setQuotaSuccessId(null);
        setQuotaError(null);

        try {
            const res = await fetch('/api/dashboard/settings/quota', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, dailyCallQuota: quota }),
            });
            const data = await res.json();
            if (!res.ok) {
                setQuotaError(data.error || 'Failed to update quota.');
            } else {
                setQuotaSuccessId(userId);
                setTimeout(() => setQuotaSuccessId(null), 3000);
            }
        } catch {
            setQuotaError('An unexpected network error occurred.');
        } finally {
            setQuotaLoadingId(null);
        }
    };

    // Add Doctor Handler
    const handleAddDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        setDoctorError('');
        if (!newDoctor.name || !newDoctor.qualification || !newDoctor.hospitalId) {
            setDoctorError('Doctor name, qualification, and affiliated hospital are required.');
            return;
        }

        setDoctorSaving(true);
        try {
            const res = await fetch('/api/dashboard/doctors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newDoctor.name,
                    qualification: newDoctor.qualification,
                    experience: newDoctor.experience,
                    hospitalId: newDoctor.hospitalId,
                    surgeryIds: newDoctor.selectedSurgeries,
                    email: newDoctor.email,
                    about: newDoctor.about
                })
            });

            const data = await res.json();
            if (!res.ok) {
                setDoctorError(data.error || 'Failed to add doctor.');
            } else {
                const addedDoctor: DoctorItem = {
                    id: data.doctor.id,
                    name: data.doctor.name,
                    qualification: data.doctor.qualification,
                    experience: data.doctor.experience,
                    about: data.doctor.about,
                    email: data.doctor.email,
                    image: data.doctor.image,
                    status: data.doctor.status,
                    hospitalId: data.doctor.hospitalId,
                    hospitalName: data.doctor.hospital?.name || 'Independent',
                    hospitalCity: data.doctor.hospital?.city || '',
                    surgeries: data.doctor.surgeries || []
                };
                setDoctors(prev => [addedDoctor, ...prev]);
                setIsAddDoctorOpen(false);
                setNewDoctor({
                    name: '',
                    qualification: '',
                    experience: 8,
                    hospitalId: hospitals[0]?.id || '',
                    selectedSurgeries: [],
                    email: '',
                    about: ''
                });
                setDeleteFeedback({ text: `${addedDoctor.name} added to CRM!`, type: 'success' });
                setTimeout(() => setDeleteFeedback(null), 3500);
            }
        } catch {
            setDoctorError('Network error while saving doctor profile.');
        } finally {
            setDoctorSaving(false);
        }
    };

    // Add Hospital Handler
    const handleAddHospital = async (e: React.FormEvent) => {
        e.preventDefault();
        setHospitalError('');
        if (!newHospital.name || !newHospital.city) {
            setHospitalError('Hospital name and city are required.');
            return;
        }

        setHospitalSaving(true);
        try {
            const res = await fetch('/api/dashboard/hospitals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHospital)
            });

            const data = await res.json();
            if (!res.ok) {
                setHospitalError(data.error || 'Failed to add hospital.');
            } else {
                const addedHospital: HospitalItem = {
                    id: data.hospital.id,
                    name: data.hospital.name,
                    city: data.hospital.city,
                    specialties: data.hospital.specialties,
                    discountPercent: data.hospital.discountPercent,
                    email: data.hospital.email,
                    status: data.hospital.status,
                    leadsCount: 0,
                    doctorsCount: 0
                };
                setHospitals(prev => [addedHospital, ...prev]);
                setIsAddHospitalOpen(false);
                setNewHospital({
                    name: '',
                    city: 'Mumbai',
                    specialties: 'Ophthalmology, Laparoscopy, Proctology',
                    discountPercent: 10,
                    email: ''
                });
                setDeleteFeedback({ text: `${addedHospital.name} added to partner network!`, type: 'success' });
                setTimeout(() => setDeleteFeedback(null), 3500);
            }
        } catch {
            setHospitalError('Network error while saving hospital.');
        } finally {
            setHospitalSaving(false);
        }
    };

    // Confirm Delete Handler
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        setIsDeleting(true);
        setDeleteFeedback(null);

        const endpoint = itemToDelete.type === 'doctor'
            ? `/api/dashboard/doctors/${itemToDelete.id}`
            : `/api/dashboard/hospitals/${itemToDelete.id}`;

        try {
            const res = await fetch(endpoint, { method: 'DELETE' });
            const data = await res.json();

            if (!res.ok) {
                setDeleteFeedback({ text: data.error || `Failed to remove ${itemToDelete.name}.`, type: 'error' });
            } else {
                if (itemToDelete.type === 'doctor') {
                    setDoctors(prev => prev.filter(d => d.id !== itemToDelete.id));
                } else {
                    setHospitals(prev => prev.filter(h => h.id !== itemToDelete.id));
                    // Also refresh doctors whose hospital was removed
                    setDoctors(prev => prev.filter(d => d.hospitalId !== itemToDelete.id));
                }
                setDeleteFeedback({ text: `${itemToDelete.name} has been removed from CRM.`, type: 'success' });
                setItemToDelete(null);
                setTimeout(() => setDeleteFeedback(null), 3500);
            }
        } catch {
            setDeleteFeedback({ text: 'Network error while attempting deletion.', type: 'error' });
        } finally {
            setIsDeleting(false);
        }
    };

    // Filtered lists
    const filteredDoctors = doctors.filter(d => 
        d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        d.qualification.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        d.hospitalName.toLowerCase().includes(doctorSearch.toLowerCase())
    );

    const filteredHospitals = hospitals.filter(h => 
        h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
        h.city.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
        h.specialties.some(s => s.toLowerCase().includes(hospitalSearch.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        CRM Settings & Network Customization
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Add and remove doctor profiles, customize partner hospitals, set team quotas, and manage system credentials.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        CRM v2.4 Live
                    </span>
                </div>
            </div>

            {/* Global Notification Banner */}
            {deleteFeedback && (
                <div className={`p-4 rounded-xl text-sm flex items-center justify-between transition-all ${
                    deleteFeedback.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                    <div className="flex items-center gap-2 font-medium">
                        {deleteFeedback.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                        <span>{deleteFeedback.text}</span>
                    </div>
                    <button onClick={() => setDeleteFeedback(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
                <button
                    onClick={() => setActiveTab('doctors')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'doctors'
                            ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
                            : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                >
                    <Stethoscope className="w-4 h-4" />
                    Doctors Directory ({doctors.length})
                </button>
                <button
                    onClick={() => setActiveTab('hospitals')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'hospitals'
                            ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
                            : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                >
                    <Building className="w-4 h-4" />
                    Hospitals Network ({hospitals.length})
                </button>
                <button
                    onClick={() => setActiveTab('team')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'team'
                            ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
                            : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                >
                    <Users className="w-4 h-4" />
                    Team Quotas ({team.length})
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'profile'
                            ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
                            : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                >
                    <UserIcon className="w-4 h-4" />
                    Profile & Password
                </button>
                <button
                    onClick={() => setActiveTab('integrations')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'integrations'
                            ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
                            : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                >
                    <Sparkles className="w-4 h-4" />
                    Integrations & AI Health
                </button>
                <button
                    onClick={() => setActiveTab('clinic')}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                        activeTab === 'clinic'
                            ? 'border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-xl'
                            : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                >
                    <Clock className="w-4 h-4" />
                    Clinic Defaults
                </button>
            </div>

            {/* TAB: DOCTORS DIRECTORY */}
            {activeTab === 'doctors' && (
                <div className="space-y-6">
                    {/* Controls Bar */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by doctor name, qualification, or hospital..."
                                value={doctorSearch}
                                onChange={(e) => setDoctorSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsAddDoctorOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-sm shadow-teal-100"
                        >
                            <Plus className="w-4 h-4" />
                            Add Doctor Profile
                        </button>
                    </div>

                    {/* Doctors List */}
                    {filteredDoctors.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-4">
                                <Stethoscope className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No Doctors Found</h3>
                            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                                {doctorSearch ? 'No doctor matches your search criteria.' : 'Your CRM directory currently has no doctor profiles. Click below to add your first specialist doctor.'}
                            </p>
                            <button
                                onClick={() => setIsAddDoctorOpen(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Doctor
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredDoctors.map((doc) => (
                                <div key={doc.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">
                                                    {doc.name.replace('Dr.', '').trim()[0] || 'D'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-base leading-tight">{doc.name}</h3>
                                                    <p className="text-xs font-semibold text-teal-700 flex items-center gap-1 mt-0.5">
                                                        <GraduationCap className="w-3.5 h-3.5" />
                                                        {doc.qualification}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setItemToDelete({ type: 'doctor', id: doc.id, name: doc.name })}
                                                title="Remove Doctor"
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span className="text-slate-400">Experience</span>
                                                <span className="font-bold text-slate-800">{doc.experience} Years</span>
                                            </div>
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span className="text-slate-400">Affiliation</span>
                                                <span className="font-medium text-slate-800 truncate max-w-[180px]">
                                                    {doc.hospitalName} {doc.hospitalCity && `(${doc.hospitalCity})`}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span className="text-slate-400">Status</span>
                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    {doc.status}
                                                </span>
                                            </div>
                                        </div>

                                        {doc.surgeries.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-[11px] uppercase font-bold text-slate-400 mb-1.5">Procedures &amp; Surgeries</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {doc.surgeries.map(s => (
                                                        <span key={s.id} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                                                            {s.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                        <span className="truncate max-w-[200px]">{doc.email}</span>
                                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                                            <Award className="w-3.5 h-3.5" /> Verified
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB: HOSPITALS NETWORK */}
            {activeTab === 'hospitals' && (
                <div className="space-y-6">
                    {/* Controls Bar */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by hospital name, city, or specialty..."
                                value={hospitalSearch}
                                onChange={(e) => setHospitalSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsAddHospitalOpen(true)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-sm shadow-teal-100"
                        >
                            <Plus className="w-4 h-4" />
                            Add Partner Hospital
                        </button>
                    </div>

                    {/* Hospitals List */}
                    {filteredHospitals.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center shadow-sm">
                            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center mb-4">
                                <Building className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No Hospitals Found</h3>
                            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                                {hospitalSearch ? 'No hospital partner matches your search.' : 'You have not added any hospital partner facilities yet. Click below to add a hospital or clinic center.'}
                            </p>
                            <button
                                onClick={() => setIsAddHospitalOpen(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add First Hospital
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredHospitals.map((hosp) => (
                                <div key={hosp.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                                                    <Building className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-base leading-tight">{hosp.name}</h3>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                        {hosp.city}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setItemToDelete({ type: 'hospital', id: hosp.id, name: hosp.name })}
                                                title="Remove Hospital"
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-2 py-3 border-y border-slate-100 text-xs">
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span className="text-slate-400">Cashless / Discount</span>
                                                <span className="font-bold text-teal-700 flex items-center gap-0.5">
                                                    <Percent className="w-3 h-3" />
                                                    {hosp.discountPercent}% Off
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span className="text-slate-400">Active Leads</span>
                                                <span className="font-semibold text-slate-800">{hosp.leadsCount} patients</span>
                                            </div>
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span className="text-slate-400">Network Doctors</span>
                                                <span className="font-semibold text-slate-800">{hosp.doctorsCount} doctors</span>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <p className="text-[11px] uppercase font-bold text-slate-400 mb-1.5">Specialties &amp; Depts</p>
                                            <div className="flex flex-wrap gap-1">
                                                {hosp.specialties.map((spec, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                                        <span className="truncate max-w-[200px]">{hosp.email}</span>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                            {hosp.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB: TEAM QUOTAS */}
            {activeTab === 'team' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">CRM Team Members &amp; Calling Targets</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Set individual daily call goals for tele-counselors. The daily progress bar tracks each member&apos;s call logs against this target.
                            </p>
                        </div>
                        {currentUser.role !== 'admin' && (
                            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                                Read-only (Admin privileges required to edit quotas)
                            </span>
                        )}
                    </div>

                    {quotaError && (
                        <div className="m-6 p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            {quotaError}
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-500 tracking-wider border-b border-slate-200/60">
                                <tr>
                                    <th className="py-3.5 px-6">Counselor</th>
                                    <th className="py-3.5 px-6">Role</th>
                                    <th className="py-3.5 px-6">Active Leads</th>
                                    <th className="py-3.5 px-6">Daily Target Quota</th>
                                    {currentUser.role === 'admin' && <th className="py-3.5 px-6 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {team.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                                                    {member.name ? member.name[0].toUpperCase() : 'T'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{member.name}</p>
                                                    <p className="text-xs text-slate-400">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                member.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-700' 
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-bold text-slate-800">{member.assignedLeadsCount}</span>
                                            <span className="text-xs text-slate-400 ml-1">leads</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {currentUser.role === 'admin' ? (
                                                <div className="flex items-center gap-2 max-w-[140px]">
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={500}
                                                        value={member.dailyCallQuota}
                                                        onChange={(e) => handleQuotaChange(member.id, parseInt(e.target.value) || 0)}
                                                        className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    />
                                                    <span className="text-xs text-slate-500 font-medium">calls/day</span>
                                                </div>
                                            ) : (
                                                <span className="font-bold text-slate-800">{member.dailyCallQuota} calls/day</span>
                                            )}
                                        </td>
                                        {currentUser.role === 'admin' && (
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => saveQuota(member.id, member.dailyCallQuota)}
                                                    disabled={quotaLoadingId === member.id}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                        quotaSuccessId === member.id
                                                            ? 'bg-emerald-600 text-white'
                                                            : 'bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700'
                                                    }`}
                                                >
                                                    {quotaSuccessId === member.id ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5" />
                                                            Saved!
                                                        </>
                                                    ) : quotaLoadingId === member.id ? (
                                                        'Saving...'
                                                    ) : (
                                                        <>
                                                            <Save className="w-3.5 h-3.5" />
                                                            Save
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB: PROFILE & PASSWORD */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-teal-100 mb-4">
                                {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                            <p className="text-sm text-slate-500 mb-4">{currentUser.email}</p>
                            
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Access Role</span>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        currentUser.role === 'admin' 
                                            ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                                    }`}>
                                        <Shield className="w-3 h-3" />
                                        {currentUser.role}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Daily Target Quota</span>
                                    <span className="font-bold text-slate-800">{currentUser.dailyCallQuota} Calls / Day</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Auth Status</span>
                                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Logged in via HealthExpress Identity Management. Passwords are encrypted with salted Bcrypt rounds.
                            </p>
                        </div>
                    </div>

                    {/* Change Password Form */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Change CRM Password</h2>
                                <p className="text-xs text-slate-500">Ensure your account uses a strong, unique password.</p>
                            </div>
                        </div>

                        {pwdMessage && (
                            <div className={`p-4 rounded-xl text-sm flex items-start gap-3 mb-6 ${
                                pwdMessage.type === 'success' 
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}>
                                {pwdMessage.type === 'success' ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                                )}
                                <p className="font-medium">{pwdMessage.text}</p>
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password (if set)"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={pwdLoading}
                                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-sm shadow-teal-100 disabled:opacity-50"
                            >
                                <Key className="w-4 h-4" />
                                {pwdLoading ? 'Updating Password...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* TAB: INTEGRATIONS & AI HEALTH */}
            {activeTab === 'integrations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Database */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                    <Database className="w-5 h-5" />
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Supabase PostgreSQL</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Real-time transaction pooler hosting leads, counselors, surgeries, and consultation logs.
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-mono text-slate-400">
                            Pooler: aws-0-ap-northeast-1 (SSL Mode)
                        </div>
                    </div>

                    {/* Bland AI */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> API Key Active
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Bland AI Autonomous Caller</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                AI Receptionist &quot;Sarah&quot; dispatches outbound calls, qualifies patient urgency, and assists with appointment booking.
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                            <span>Carrier Routing:</span>
                            <span className="font-semibold text-purple-700">Indian Mobile Network (+91)</span>
                        </div>
                    </div>

                    {/* Resend Email */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Resend Email Gateway</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Transactional email pipeline for consultation confirmations, partner approvals, and doctor notifications.
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
                            Sender: <span className="font-medium text-slate-700">sai@healthexpressindia.com</span>
                        </div>
                    </div>

                    {/* Meta Ads & Pixel */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    M
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tracking Active
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Meta Pixel &amp; Conversion API</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Tracks ad campaign conversions across Facebook &amp; Instagram for Lasik, Cataract, and Laparoscopy campaigns.
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
                            Pixel ID: 2647191662345776
                        </div>
                    </div>

                    {/* Google Analytics & Ads */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                    G
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">Google Analytics &amp; Ads</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                GA4 Measurement &amp; Google Ads tag tracking high-intent landing page submissions and click-to-call conversions.
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
                            GA4: G-HJ1V4B9QQQ | Ads: AW-16966558904
                        </div>
                    </div>

                    {/* WhatsApp Business */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 text-base">WhatsApp Support Gateway</h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Real-time patient concierge button routing instant chat consultations to medical coordinators.
                            </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-700 font-semibold">
                            +91 93078 61041
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: CLINIC DEFAULTS */}
            {activeTab === 'clinic' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Hospital Network &amp; Operational Defaults</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Core healthcare network operating parameters used across automated dispatches and lead assignments.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
                            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
                                <Phone className="w-4 h-4" />
                                Dedicated Central Helpline
                            </div>
                            <p className="text-xl font-bold text-slate-900">+91 93078 61041</p>
                            <p className="text-xs text-slate-500">
                                Displayed in patient SMS notifications, callback confirmations, and the website header.
                            </p>
                        </div>

                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-3">
                            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
                                <Clock className="w-4 h-4" />
                                Working Hours &amp; Calling SLA
                            </div>
                            <p className="text-xl font-bold text-slate-900">9:00 AM – 8:00 PM IST</p>
                            <p className="text-xs text-slate-500">
                                Target response SLA: Contact new patient inquiries within 15 minutes of submission.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">Primary Surgery Hubs &amp; Coverage Areas</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Mumbai Central', 'Thane', 'Navi Mumbai', 'Kalyan & Dombivli', 'Pune', 'Delhi NCR'].map((city) => (
                                <span key={city} className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                                    📍 {city}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">Supported Surgical Disciplines</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Ophthalmology (LASIK / Cataract)', 'Proctology (Piles / Fissure / Fistula)', 'Laparoscopy (Hernia / Gallbladder)', 'Urology (Kidney Stones)', 'Vascular (Varicose Veins)', 'Gynecology'].map((spec) => (
                                <span key={spec} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                                    🩺 {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: ADD DOCTOR */}
            {isAddDoctorOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                                    <Stethoscope className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Add Doctor Profile</h3>
                            </div>
                            <button onClick={() => setIsAddDoctorOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddDoctor} className="p-6 overflow-y-auto space-y-4">
                            {doctorError && (
                                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                    {doctorError}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Doctor Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Dr. Rajesh Sharma"
                                    value={newDoctor.name}
                                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Qualification / Degrees *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. MBBS, MS - Ophthalmology"
                                        value={newDoctor.qualification}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Experience (Years) *
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={50}
                                        required
                                        value={newDoctor.experience}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, experience: Number(e.target.value) || 1 })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Affiliated Hospital / Center *
                                </label>
                                <select
                                    required
                                    value={newDoctor.hospitalId}
                                    onChange={(e) => setNewDoctor({ ...newDoctor, hospitalId: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                >
                                    <option value="">Select affiliated hospital...</option>
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>
                                            {h.name} ({h.city})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Associated Surgeries &amp; Procedures
                                </label>
                                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    {availableSurgeries.map((s) => (
                                        <label key={s.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900">
                                            <input
                                                type="checkbox"
                                                checked={newDoctor.selectedSurgeries.includes(s.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewDoctor({ ...newDoctor, selectedSurgeries: [...newDoctor.selectedSurgeries, s.id] });
                                                    } else {
                                                        setNewDoctor({ ...newDoctor, selectedSurgeries: newDoctor.selectedSurgeries.filter(id => id !== s.id) });
                                                    }
                                                }}
                                                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                            />
                                            <span className="truncate">{s.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="doctor@hospital.com"
                                        value={newDoctor.email}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Doctor Bio / Specialization
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Expert in Contoura Vision &amp; Phacoemulsification"
                                        value={newDoctor.about}
                                        onChange={(e) => setNewDoctor({ ...newDoctor, about: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddDoctorOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={doctorSaving}
                                    className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm shadow-teal-100 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {doctorSaving ? 'Saving...' : 'Add Doctor Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADD HOSPITAL */}
            {isAddHospitalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                    <Building className="w-4 h-4" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Add Partner Hospital</h3>
                            </div>
                            <button onClick={() => setIsAddHospitalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddHospital} className="p-6 overflow-y-auto space-y-4">
                            {hospitalError && (
                                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                    {hospitalError}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Hospital / Facility Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Apollo Spectra Hospital"
                                    value={newHospital.name}
                                    onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        City / Location *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Mumbai or Thane"
                                        value={newHospital.city}
                                        onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                        Discount / Cashless Tie-up (%)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={newHospital.discountPercent}
                                        onChange={(e) => setNewHospital({ ...newHospital, discountPercent: Number(e.target.value) || 0 })}
                                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Specialties (Comma Separated) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ophthalmology, Laparoscopy, Proctology, Urology"
                                    value={newHospital.specialties}
                                    onChange={(e) => setNewHospital({ ...newHospital, specialties: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Contact / Portal Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    placeholder="partners@hospital.com"
                                    value={newHospital.email}
                                    onChange={(e) => setNewHospital({ ...newHospital, email: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddHospitalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={hospitalSaving}
                                    className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-sm shadow-teal-100 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {hospitalSaving ? 'Saving...' : 'Add Partner Hospital'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: CONFIRM DELETION */}
            {itemToDelete && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-900">
                                Remove {itemToDelete.type === 'doctor' ? 'Doctor Profile' : 'Partner Hospital'}?
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                                Are you sure you want to remove <span className="font-bold text-slate-800">{itemToDelete.name}</span> from the CRM?
                                {itemToDelete.type === 'hospital' && ' Any associated leads will be unlinked safely.'}
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setItemToDelete(null)}
                                className="flex-1 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleConfirmDelete}
                                className="flex-1 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? 'Removing...' : 'Confirm Remove'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
