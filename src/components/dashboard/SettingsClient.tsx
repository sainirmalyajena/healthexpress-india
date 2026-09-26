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
    Lock
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

interface SettingsClientProps {
    currentUser: CurrentUser;
    teamMembers: TeamMember[];
}

export default function SettingsClient({ currentUser, teamMembers: initialTeam }: SettingsClientProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'integrations' | 'clinic'>('profile');

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        CRM Settings & Preferences
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage your account credentials, team calling quotas, connected integrations, and clinic settings.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        CRM v2.4 Active
                    </span>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
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
                    <Building className="w-4 h-4" />
                    Clinic & Operating Defaults
                </button>
            </div>

            {/* TAB 1: Profile & Password */}
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

            {/* TAB 2: Team Quotas */}
            {activeTab === 'team' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">CRM Team Members & Calling Targets</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Set individual daily call goals for tele-counselors. The daily progress bar tracks each member's call logs against this target.
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

            {/* TAB 3: Integrations & AI Health */}
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
                            <span>International Calls:</span>
                            <span className="font-semibold text-purple-700">Indian Carrier Linked</span>
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
                            <h3 className="font-bold text-slate-900 text-base">Meta Pixel & Conversion API</h3>
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

            {/* TAB 4: Clinic Defaults */}
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
        </div>
    );
}
