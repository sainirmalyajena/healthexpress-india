'use client';

import { useState } from 'react';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    lastActiveAt: string | null;
    dailyCallQuota: number;
    totalLeads: number;
    todayCalls: number;
    avgSpeedToLead: number | null;
}

interface ActivityEntry {
    id: string;
    userName: string;
    leadName: string | null;
    leadPhone: string | null;
    actionType: string;
    details: string | null;
    createdAt: string;
}

interface TeamAnalyticsProps {
    team: TeamMember[];
    activityFeed: ActivityEntry[];
}

function isOnline(lastActiveAt: string | null): boolean {
    if (!lastActiveAt) return false;
    const diff = Date.now() - new Date(lastActiveAt).getTime();
    return diff < 5 * 60 * 1000; // 5 minutes
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function getActionLabel(actionType: string, details: string | null): string {
    switch (actionType) {
        case 'STATUS_CHANGED': {
            if (details) {
                try {
                    const d = JSON.parse(details);
                    return `Changed status: ${d.from} ? ${d.to}`;
                } catch { /* fall through */ }
            }
            return 'Changed lead status';
        }
        case 'CALL_LOGGED': {
            if (details) {
                try {
                    const d = JSON.parse(details);
                    return `Logged call: ${d.outcome}${d.note ? `  "${d.note}"` : ''}`;
                } catch { /* fall through */ }
            }
            return 'Logged a call';
        }
        case 'NOTE_ADDED':
            return 'Added a note';
        case 'LEAD_ASSIGNED':
            return 'Lead assigned';
        case 'LOGIN':
            return 'Logged in';
        default:
            return actionType;
    }
}

function getActionEmoji(actionType: string): string {
    switch (actionType) {
        case 'STATUS_CHANGED': return '??';
        case 'CALL_LOGGED': return '??';
        case 'NOTE_ADDED': return '??';
        case 'LEAD_ASSIGNED': return '??';
        case 'LOGIN': return '??';
        default: return '??';
    }
}

export default function TeamAnalytics({ team, activityFeed }: TeamAnalyticsProps) {
    const [activeTab, setActiveTab] = useState<'team' | 'feed'>('team');

    const totalCallsToday = team.reduce((sum, m) => sum + m.todayCalls, 0);
    const onlineCount = team.filter((m) => isOnline(m.lastActiveAt)).length;

    return (
        <div>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Team Members</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{team.length}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Online Now</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{onlineCount}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Calls Today</p>
                    <p className="text-2xl font-bold text-teal-600 mt-1">{totalCallsToday}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Activities Today</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">{activityFeed.length}</p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-6 w-fit">
                <button
                    onClick={() => setActiveTab('team')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'team' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    ?? Team Overview
                </button>
                <button
                    onClick={() => setActiveTab('feed')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === 'feed' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    ?? Live Activity Feed
                </button>
            </div>

            {activeTab === 'team' ? (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Agent</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Total Leads</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Calls Today</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Call Progress</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Speed to Lead</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.map((member) => {
                                const online = isOnline(member.lastActiveAt);
                                const callPct = Math.min((member.todayCalls / member.dailyCallQuota) * 100, 100);
                                return (
                                    <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-semibold text-slate-800">{member.name}</p>
                                            <p className="text-xs text-slate-400">{member.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                                online ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                                                {online ? 'Online' : 'Offline'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm font-medium text-slate-700">{member.totalLeads}</td>
                                        <td className="px-4 py-3 text-center text-sm font-bold text-teal-600">{member.todayCalls}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            callPct >= 100 ? 'bg-green-500' : 'bg-teal-500'
                                                        }`}
                                                        style={{ width: `${callPct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-500 w-10 text-right">{Math.round(callPct)}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {member.avgSpeedToLead !== null ? (
                                                <span className={`text-sm font-medium ${
                                                    member.avgSpeedToLead <= 5 ? 'text-green-600' :
                                                    member.avgSpeedToLead <= 30 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                    {member.avgSpeedToLead} min
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-400"></span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {team.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">No team members yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    {activityFeed.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">No activity logged today yet</p>
                    ) : (
                        <div className="space-y-3">
                            {activityFeed.map((entry) => (
                                <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    <span className="text-lg mt-0.5">{getActionEmoji(entry.actionType)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800">
                                            <span className="font-semibold">{entry.userName}</span>
                                            {' '}
                                            {getActionLabel(entry.actionType, entry.details)}
                                        </p>
                                        {entry.leadName && (
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                Lead: {entry.leadName} ({entry.leadPhone})
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{formatTime(entry.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

