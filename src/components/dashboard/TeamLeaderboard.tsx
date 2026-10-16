'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Scale, CheckCircle2, AlertCircle, TrendingUp, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface CoordinatorStats {
    id: string;
    name: string;
    initials: string;
    todayOpds: number;
    weekOpds: number;
    monthOpds: number;
    surgeriesDone: number;
    surgeryRevenue: number;
    activeLeads: number;
    overdueFollowUps: number;
    onTimeRate: number; // 0 - 100%
}

interface TeamLeaderboardProps {
    teamStats: CoordinatorStats[];
    userRole: string;
    lang: string;
}

export default function TeamLeaderboard({ teamStats: initialStats = [], userRole = 'admin', lang = 'en' }: TeamLeaderboardProps) {
    const router = useRouter();
    const safeStats = Array.isArray(initialStats) ? initialStats : [];
    const [teamStats, setTeamStats] = useState<CoordinatorStats[]>(safeStats);
    const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
    const [showRebalanceModal, setShowRebalanceModal] = useState(false);
    const [isRebalancing, setIsRebalancing] = useState(false);
    const [rebalanceResult, setRebalanceResult] = useState<string | null>(null);

    const currentStats = Array.isArray(teamStats) ? teamStats : safeStats;

    // Sort coordinators based on chosen timeframe OPDs, then surgeries, then active leads
    const sortedTeam = [...currentStats].sort((a, b) => {
        const opdA = timeframe === 'today' ? (a.todayOpds || 0) : timeframe === 'week' ? (a.weekOpds || 0) : (a.monthOpds || 0);
        const opdB = timeframe === 'today' ? (b.todayOpds || 0) : timeframe === 'week' ? (b.weekOpds || 0) : (b.monthOpds || 0);
        if (opdB !== opdA) return opdB - opdA;
        if ((b.surgeriesDone || 0) !== (a.surgeriesDone || 0)) return (b.surgeriesDone || 0) - (a.surgeriesDone || 0);
        return (b.activeLeads || 0) - (a.activeLeads || 0);
    });

    const totalActiveLeads = currentStats.reduce((sum, c) => sum + (c.activeLeads || 0), 0);
    const avgLeadsPerCoord = currentStats.length > 0 ? Math.round(totalActiveLeads / currentStats.length) : 0;
    const hasImbalance = currentStats.some(c => (c.activeLeads || 0) > avgLeadsPerCoord * 1.5 && (c.activeLeads || 0) > 25);

    const handleRebalance = async () => {
        setIsRebalancing(true);
        setRebalanceResult(null);
        try {
            const res = await fetch('/api/dashboard/team/rebalance', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                setRebalanceResult(`Successfully redistributed ${data.rebalancedCount} leads! Target: ~${data.targetQuota} leads per coordinator.`);
                setTimeout(() => {
                    setShowRebalanceModal(false);
                    router.refresh();
                }, 1800);
            } else {
                alert(data.error || 'Failed to rebalance leads');
            }
        } catch {
            alert('Network error while rebalancing leads');
        } finally {
            setIsRebalancing(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 shrink-0">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">Team Performance</h2>
                        <p className="text-xs text-slate-500">Live coordinator conversion & workload</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Timeframe Toggle */}
                    <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                        <button
                            onClick={() => setTimeframe('today')}
                            className={`px-2.5 py-1 rounded-lg transition-all ${timeframe === 'today' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'hover:text-slate-900'}`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setTimeframe('week')}
                            className={`px-2.5 py-1 rounded-lg transition-all ${timeframe === 'week' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'hover:text-slate-900'}`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setTimeframe('month')}
                            className={`px-2.5 py-1 rounded-lg transition-all ${timeframe === 'month' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'hover:text-slate-900'}`}
                        >
                            Month
                        </button>
                    </div>

                    {/* Rebalance Button (Admin only) */}
                    {userRole === 'admin' && (
                        <button
                            onClick={() => setShowRebalanceModal(true)}
                            className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                hasImbalance
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-orange-100'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            title="Distribute active leads evenly across coordinators"
                        >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Rebalance</span>
                            {hasImbalance && (
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                </span>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Imbalance alert badge */}
            {hasImbalance && userRole === 'admin' && (
                <div className="mb-4 px-3.5 py-2 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Workload is uneven. Some coordinators have 3x more leads than others.</span>
                    </span>
                    <button
                        onClick={() => setShowRebalanceModal(true)}
                        className="font-bold underline text-amber-900 hover:text-amber-950 whitespace-nowrap"
                    >
                        Fix Now
                    </button>
                </div>
            )}

            {/* Coordinators List */}
            <div className="space-y-3 flex-1 overflow-y-auto">
                {sortedTeam.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-sm">
                        No team coordinators found.
                    </div>
                ) : (
                    sortedTeam.map((member, idx) => {
                        const opdsCount = timeframe === 'today' ? member.todayOpds : timeframe === 'week' ? member.weekOpds : member.monthOpds;
                        const isTop = idx === 0 && opdsCount > 0;
                        const isOverloaded = member.activeLeads > avgLeadsPerCoord * 1.4 && member.activeLeads > 30;

                        return (
                            <div
                                key={member.id}
                                className={`p-3.5 rounded-2xl border transition-all ${
                                    isTop
                                        ? 'bg-gradient-to-r from-amber-50/60 to-white border-amber-200 shadow-sm'
                                        : 'bg-slate-50/80 border-slate-100 hover:border-slate-200'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    {/* Member info */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative shrink-0">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs ${
                                                idx === 0
                                                    ? 'bg-amber-400 text-amber-950 shadow-sm shadow-amber-200'
                                                    : idx === 1
                                                    ? 'bg-slate-200 text-slate-800'
                                                    : idx === 2
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'bg-white text-slate-600 border border-slate-200'
                                            }`}>
                                                {member.initials}
                                            </div>
                                            <span className="absolute -bottom-1 -right-1 text-[10px] font-black bg-white rounded-full w-4 h-4 flex items-center justify-center border border-slate-200 shadow-xs">
                                                #{idx + 1}
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                                                <span>{member.name}</span>
                                                {isTop && <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                                                <span className={`font-semibold ${isOverloaded ? 'text-amber-700' : 'text-slate-600'}`}>
                                                    {member.activeLeads} active leads
                                                </span>
                                                <span>•</span>
                                                <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                                    <TrendingUp className="w-3 h-3" /> {member.surgeriesDone} Surg
                                                    {member.surgeryRevenue > 0 && ` (${formatCurrency(member.surgeryRevenue)})`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* OPD Counter Badge */}
                                    <div className="text-right shrink-0">
                                        <div className="inline-flex flex-col items-end">
                                            <span className="text-xl font-black text-indigo-600 leading-none">
                                                {opdsCount}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                                                {timeframe === 'today' ? 'Today OPD' : timeframe === 'week' ? 'Week OPD' : 'Month OPD'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Workload & Follow-up Health Progress Bar */}
                                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-slate-400">Workload share:</span>
                                            <span className="font-semibold text-slate-700">
                                                {totalActiveLeads > 0 ? Math.round((member.activeLeads / totalActiveLeads) * 100) : 0}% of leads
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    isOverloaded ? 'bg-amber-500' : 'bg-teal-500'
                                                }`}
                                                style={{ width: `${Math.min(100, totalActiveLeads > 0 ? (member.activeLeads / totalActiveLeads) * 200 : 0)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                        {member.overdueFollowUps > 0 ? (
                                            <span className="inline-flex items-center gap-1 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                                                ⚠️ {member.overdueFollowUps} overdue
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                                <CheckCircle2 className="w-3 h-3" /> Up to date
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Rebalance Modal */}
            {showRebalanceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                                <Scale className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Equalize Coordinator Workload</h3>
                                <p className="text-xs text-slate-500">Prevent neglected leads by balancing active cases</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                            <div className="flex justify-between text-slate-600">
                                <span>Total Active Inquiries:</span>
                                <strong className="text-slate-900">{totalActiveLeads} leads</strong>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Active Coordinators:</span>
                                <strong className="text-slate-900">{teamStats.length} members</strong>
                            </div>
                            <div className="flex justify-between text-teal-700 font-semibold border-t border-slate-200 pt-2">
                                <span>Target per Coordinator:</span>
                                <span>~{avgLeadsPerCoord} active leads each</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                            This will automatically take excess uncontacted and fresh leads from overloaded coordinators and unassigned pools, and redistribute them fairly so all team members have equal opportunity to book OPDs.
                        </p>

                        {rebalanceResult && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{rebalanceResult}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowRebalanceModal(false)}
                                disabled={isRebalancing}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleRebalance}
                                disabled={isRebalancing}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition shadow-sm disabled:opacity-50"
                            >
                                {isRebalancing ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Redistributing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Scale className="w-3.5 h-3.5" />
                                        <span>Redistribute Evenly Now</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
