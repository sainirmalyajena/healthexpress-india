'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, PhoneCall, Building2, MessageCircle, Clock, ChevronLeft, ChevronRight, CheckCircle2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { formatWhatsAppPhone, generateOpdWhatsAppMessage, getSmartLeadWhatsAppDetails } from '@/lib/utils';

interface OpdLead {
    id: string;
    fullName: string;
    phone: string;
    city?: string | null;
    status: string;
    opdDate?: Date | string | null;
    hospital?: {
        id: string;
        name: string;
        address?: string | null;
        googleMapsUrl?: string | null;
    } | null;
    assignedUser?: {
        id: string;
        name: string;
    } | null;
    surgery?: {
        name: string;
    } | null;
}

interface OpdScheduleWidgetProps {
    initialLeads: OpdLead[];
    initialDateStr: string; // YYYY-MM-DD
    userRole?: string;
    lang?: string;
}

const OPD_STATUS_OPTIONS = [
    { value: 'OPD_SCHEDULED', label: 'OPD Scheduled', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { value: 'OPD_DONE', label: 'OPD Done', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'OPD_RESCHEDULE', label: 'OPD Reschedule', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { value: 'SURGERY_SUGGESTED', label: 'Surgery Suggested', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    { value: 'SURGERY_SCHEDULED', label: 'Surgery Scheduled', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'SURGERY_DONE', label: 'Surgery Done', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { value: 'DNP', label: 'DNP (Did Not Pick)', color: 'bg-red-50 text-red-700 border-red-200' },
    { value: 'FOLLOW_UP', label: 'Follow Up', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'CLOSED', label: 'Closed', color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { value: 'LOST', label: 'Lost', color: 'bg-slate-100 text-slate-500 border-slate-200' },
];

export default function OpdScheduleWidget({
    initialLeads,
    initialDateStr,
    userRole = 'admin',
    lang = 'en',
}: OpdScheduleWidgetProps) {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<string>(initialDateStr);
    const [leads, setLeads] = useState<OpdLead[]>(initialLeads);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [loading, setLoading] = useState<boolean>(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [feedbackMsg, setFeedbackMsg] = useState<{ id: string; text: string } | null>(null);
    const [, startTransition] = useTransition();

    // Fetch leads when selected date changes
    const fetchLeadsForDate = async (dateStr: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/dashboard/opds?date=${dateStr}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.leads)) {
                setLeads(data.leads);
            }
        } catch (err) {
            console.error('Failed to load OPD leads for date', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (newDate: string) => {
        setSelectedDate(newDate);
        fetchLeadsForDate(newDate);
    };

    const handleShiftDay = (deltaDays: number) => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        dateObj.setDate(dateObj.getDate() + deltaDays);
        const nextY = dateObj.getFullYear();
        const nextM = String(dateObj.getMonth() + 1).padStart(2, '0');
        const nextD = String(dateObj.getDate()).padStart(2, '0');
        const nextDateStr = `${nextY}-${nextM}-${nextD}`;
        handleDateChange(nextDateStr);
    };

    const handleQuickDate = (type: 'today' | 'tomorrow' | 'yesterday') => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric', month: 'numeric', day: 'numeric',
        });
        const istParts = formatter.format(now).split('/').map(Number);
        const base = new Date(istParts[2], istParts[0] - 1, istParts[1]);

        if (type === 'tomorrow') {
            base.setDate(base.getDate() + 1);
        } else if (type === 'yesterday') {
            base.setDate(base.getDate() - 1);
        }

        const y = base.getFullYear();
        const m = String(base.getMonth() + 1).padStart(2, '0');
        const d = String(base.getDate()).padStart(2, '0');
        handleDateChange(`${y}-${m}-${d}`);
    };

    const handleStatusChange = async (leadId: string, newStatus: string) => {
        setUpdatingId(leadId);
        // 1. Optimistic local update
        setLeads((prev) =>
            prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );

        setFeedbackMsg({ id: leadId, text: 'Status updated!' });
        setTimeout(() => setFeedbackMsg(null), 3000);

        try {
            await fetch(`/api/dashboard/leads/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            startTransition(() => {
                router.refresh();
            });
        } catch (err) {
            console.error('Failed to update lead status', err);
        } finally {
            setUpdatingId(null);
        }
    };

    // Filter leads by status if active
    const filteredLeads = leads.filter((lead) => {
        if (statusFilter === 'ALL') return true;
        return lead.status === statusFilter;
    });

    // Format human-friendly display date
    const formatDisplayDate = (dateStr: string) => {
        try {
            const [y, m, d] = dateStr.split('-').map(Number);
            const dateObj = new Date(y, m - 1, d);
            return new Intl.DateTimeFormat('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }).format(dateObj);
        } catch {
            return dateStr;
        }
    };

    const isToday = selectedDate === initialDateStr;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 flex flex-col relative overflow-hidden">
            {/* Header / Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base md:text-lg font-black text-slate-800 tracking-tight">
                                OPD Schedule & Status Manager
                            </h2>
                            {isToday && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                                    Today
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Pick any specific date to view & update OPD booking statuses
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                        {leads.length} Booked
                    </span>
                    {loading && (
                        <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                    )}
                </div>
            </div>

            {/* Interactive Date Bar & Status Filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                {/* Date Controls */}
                <div className="flex items-center flex-wrap gap-1.5">
                    <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-sm p-0.5">
                        <button
                            type="button"
                            onClick={() => handleShiftDay(-1)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            title="Previous Day"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        {/* Native Date Picker */}
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => e.target.value && handleDateChange(e.target.value)}
                            className="px-2 py-1 text-base sm:text-xs font-bold text-slate-700 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
                        />

                        <button
                            type="button"
                            onClick={() => handleShiftDay(1)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                            title="Next Day"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Quick Jump Buttons */}
                    <button
                        type="button"
                        onClick={() => handleQuickDate('today')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                            isToday
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickDate('tomorrow')}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all"
                    >
                        Tomorrow
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickDate('yesterday')}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-all hidden md:inline-block"
                    >
                        Yesterday
                    </button>
                </div>

                {/* Status Filter Dropdown */}
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-base sm:text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    >
                        <option value="ALL">All ({leads.length})</option>
                        {OPD_STATUS_OPTIONS.map((opt) => {
                            const count = leads.filter((l) => l.status === opt.value).length;
                            return (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label} ({count})
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Leads List */}
            {filteredLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <Calendar className="w-10 h-10 mb-2 text-slate-300" />
                    <p className="text-sm font-bold text-slate-700">
                        No OPDs found for {formatDisplayDate(selectedDate)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        {statusFilter !== 'ALL'
                            ? `No appointments with status "${statusFilter.replace(/_/g, ' ')}" on this date.`
                            : 'There are no OPD appointments scheduled for this date.'}
                    </p>
                    {!isToday && (
                        <button
                            type="button"
                            onClick={() => handleQuickDate('today')}
                            className="mt-3 px-3 py-1.5 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl transition-colors"
                        >
                            Back to Today's OPDs
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                    {filteredLeads.map((lead) => {
                        const currentStatusOpt =
                            OPD_STATUS_OPTIONS.find((o) => o.value === lead.status) || {
                                label: lead.status.replace(/_/g, ' '),
                                color: 'bg-slate-100 text-slate-700 border-slate-200',
                            };

                        // Scheduled time in IST
                        const timeStr = lead.opdDate
                            ? new Date(lead.opdDate).toLocaleTimeString('en-IN', {
                                  timeZone: 'Asia/Kolkata',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  hour12: true,
                              })
                            : 'TBD';

                        // WhatsApp Message & Link (Smart: auto-switches to Post-OPD follow-up if time is passed or status is done)
                        const waDetails = getSmartLeadWhatsAppDetails({
                            patientName: lead.fullName,
                            phone: lead.phone,
                            status: lead.status,
                            opdDate: lead.opdDate,
                            hospitalName: lead.hospital?.name,
                            hospitalAddress: lead.hospital?.address,
                            googleMapsUrl: lead.hospital?.googleMapsUrl,
                            surgeryName: lead.surgery?.name,
                            city: lead.city,
                        });

                        return (
                            <div
                                key={lead.id}
                                className="group p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                            >
                                {/* Left Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <Link
                                            href={`/${lang}/dashboard/leads/${lead.id}`}
                                            className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors truncate"
                                        >
                                            {lead.fullName}
                                        </Link>
                                        <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {timeStr}
                                        </span>
                                        {lead.surgery && (
                                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                {lead.surgery.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                                        <span className="flex items-center gap-1 font-medium text-slate-700">
                                            <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                            <span className="truncate max-w-[200px]">
                                                {lead.hospital?.name || 'Hospital Not Set'}
                                            </span>
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-slate-600 font-medium">
                                            {lead.phone}
                                        </span>
                                        {userRole !== 'team' && lead.assignedUser && (
                                            <>
                                                <span className="text-slate-300">•</span>
                                                <span className="text-[11px] text-slate-400">
                                                    Agent: {lead.assignedUser.name}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Right Controls: Quick Status Selector + Quick WhatsApp + Call */}
                                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                    {/* Inline Status Changer ("pand cake the status") */}
                                    <div className="relative">
                                        <select
                                            value={lead.status}
                                            disabled={updatingId === lead.id}
                                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                            className={`text-base sm:text-xs font-bold rounded-xl px-2.5 py-1.5 border cursor-pointer transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${currentStatusOpt.color}`}
                                        >
                                            {OPD_STATUS_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        {feedbackMsg?.id === lead.id && (
                                            <span className="absolute -top-6 right-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shadow whitespace-nowrap animate-fade-in flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" /> Updated
                                            </span>
                                        )}
                                    </div>

                                    {/* Quick WhatsApp Button (Auto-switches to Post-OPD Follow-up once OPD time is done!) */}
                                    <a
                                        href={waDetails.encodedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-1.5 rounded-xl transition-colors border flex items-center gap-1 px-2.5 text-xs font-bold shadow-sm ${
                                            waDetails.isPostOpd 
                                                ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' 
                                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                                        }`}
                                        title={waDetails.buttonTitle}
                                    >
                                        <MessageCircle className={`w-3.5 h-3.5 ${waDetails.isPostOpd ? 'text-blue-600' : 'text-emerald-600'}`} />
                                        <span className="hidden sm:inline">{waDetails.actionLabel}</span>
                                    </a>

                                    {/* Direct Phone Call Button */}
                                    <a
                                        href={`tel:${lead.phone}`}
                                        className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl transition-colors border border-teal-200"
                                        title={`Call ${lead.fullName}`}
                                    >
                                        <PhoneCall className="w-3.5 h-3.5" />
                                    </a>

                                    {/* Lead Detail link */}
                                    <Link
                                        href={`/${lang}/dashboard/leads/${lead.id}`}
                                        className="text-xs font-bold text-slate-400 hover:text-indigo-600 px-2 py-1 transition-colors"
                                    >
                                        Details →
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
