const fs = require('fs');
const path = require('path');

const dir = 'src/app/[lang]/dashboard/seo';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const code = import { getAdminSession } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SeoDashboardClient from '@/components/dashboard/seo/SeoDashboardClient';

export default async function SeoDashboardPage({ params }: { params: { lang: string } }) {
    const session = await getAdminSession();
    if (!session || session.role !== 'admin') {
        redirect(\/\/login\);
    }

    const rawData = await prisma.seoQueryData.findMany({
        orderBy: { impressions: 'desc' }
    });

    const opportunities = await prisma.seoOpportunity.findMany({
        orderBy: { score: 'desc' }
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">SEO Opportunity Engine</h1>
                    <p className="text-slate-600 mt-1">AI-driven search console analysis and content recommendations.</p>
                </div>
            </div>
            <SeoDashboardClient rawData={rawData} opportunities={opportunities} />
        </div>
    );
}
;

fs.writeFileSync(path.join(dir, 'page.tsx'), code);

const compDir = 'src/components/dashboard/seo';
if (!fs.existsSync(compDir)){
    fs.mkdirSync(compDir, { recursive: true });
}

const clientCode = 'use client';
import { useState } from 'react';
import QuickWinsTable from './QuickWinsTable';
import ContentGapsTable from './ContentGapsTable';
import WeeklyReport from './WeeklyReport';

export default function SeoDashboardClient({ rawData, opportunities }: { rawData: any[], opportunities: any[] }) {
    const [view, setView] = useState<'NON_BRAND' | 'BRAND'>('NON_BRAND');

    const filteredOpportunities = opportunities.filter(o => 
        view === 'BRAND' ? rawData.find(r => r.query === o.query)?.isBranded : !rawData.find(r => r.query === o.query)?.isBranded
    );

    const quickWins = filteredOpportunities.filter(o => o.type === 'QUICK_WIN');
    const growth = filteredOpportunities.filter(o => o.type === 'GROWTH');
    const gaps = filteredOpportunities.filter(o => o.type === 'GAP');
    const cannibalization = filteredOpportunities.filter(o => o.type === 'CANNIBALIZATION');

    const totalImpressions = rawData.filter(r => r.isBranded === (view === 'BRAND')).reduce((sum, r) => sum + r.impressions, 0);
    const totalClicks = rawData.filter(r => r.isBranded === (view === 'BRAND')).reduce((sum, r) => sum + r.clicks, 0);

    return (
        <div className="space-y-8">
            <div className="flex gap-4 border-b border-slate-200">
                <button 
                    onClick={() => setView('NON_BRAND')}
                    className={\py-2 px-4 border-b-2 font-medium transition-colors \\}
                >
                    Non-Branded SEO
                </button>
                <button 
                    onClick={() => setView('BRAND')}
                    className={\py-2 px-4 border-b-2 font-medium transition-colors \\}
                >
                    Branded SEO
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500">Total Impressions</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalImpressions.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500">Organic Clicks</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalClicks.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500">Avg CTR</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                        {totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0}%
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm font-medium text-slate-500">Opportunities Found</p>
                    <p className="text-3xl font-bold text-teal-600 mt-2">{filteredOpportunities.length}</p>
                </div>
            </div>

            <WeeklyReport quickWins={quickWins} gaps={gaps} cannibalization={cannibalization} />

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">1. Quick Wins (Pos 4-20)</h2>
                <QuickWinsTable opportunities={quickWins} />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">2. Growth Opportunities (Pos 21-50)</h2>
                <QuickWinsTable opportunities={growth} />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">3. Content Gaps</h2>
                <ContentGapsTable opportunities={gaps} />
            </div>
        </div>
    );
}
;

fs.writeFileSync(path.join(compDir, 'SeoDashboardClient.tsx'), clientCode);

const tableCode = 
export default function QuickWinsTable({ opportunities }: { opportunities: any[] }) {
    if (!opportunities.length) return <p className="text-slate-500">No opportunities found in this category.</p>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                            <th className="p-4 font-semibold">Query</th>
                            <th className="p-4 font-semibold">Score</th>
                            <th className="p-4 font-semibold">Position</th>
                            <th className="p-4 font-semibold">Impressions</th>
                            <th className="p-4 font-semibold">AI Recommendation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {opportunities.map(opp => {
                            const rec = JSON.parse(opp.recommendation || '{}');
                            return (
                                <tr key={opp.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-900">
                                        {opp.query}
                                        <div className="text-xs text-slate-500 mt-1 font-normal">{opp.intent}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {opp.score}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-600">{opp.position.toFixed(1)}</td>
                                    <td className="p-4 text-slate-600">{opp.impressions.toLocaleString()}</td>
                                    <td className="p-4 max-w-md">
                                        <div className="text-xs text-slate-600 space-y-1">
                                            <p><strong className="text-slate-800">Action:</strong> {rec.action}</p>
                                            <p><strong className="text-slate-800">Title:</strong> {rec.title}</p>
                                            <p><strong className="text-slate-800">Content:</strong> {rec.supportingContent}</p>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
;

fs.writeFileSync(path.join(compDir, 'QuickWinsTable.tsx'), tableCode);

const gapCode = 
export default function ContentGapsTable({ opportunities }: { opportunities: any[] }) {
    if (!opportunities.length) return <p className="text-slate-500">No content gaps found.</p>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                            <th className="p-4 font-semibold">Missing Topic / Query</th>
                            <th className="p-4 font-semibold">Intent</th>
                            <th className="p-4 font-semibold">Impressions Lost</th>
                            <th className="p-4 font-semibold">AI Recommendation</th>
                            <th className="p-4 font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {opportunities.map(opp => {
                            const rec = JSON.parse(opp.recommendation || '{}');
                            return (
                                <tr key={opp.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-900">{opp.query}</td>
                                    <td className="p-4 text-slate-600">{opp.intent}</td>
                                    <td className="p-4 text-slate-600">{opp.impressions.toLocaleString()}</td>
                                    <td className="p-4 max-w-sm">
                                        <p className="text-xs text-slate-600">{rec.supportingContent}</p>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-teal-600 hover:text-teal-800 text-xs font-medium bg-teal-50 px-3 py-1.5 rounded-lg transition-colors">
                                            Draft Page
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
;

fs.writeFileSync(path.join(compDir, 'ContentGapsTable.tsx'), gapCode);

const reportCode = 
export default function WeeklyReport({ quickWins, gaps, cannibalization }: { quickWins: any[], gaps: any[], cannibalization: any[] }) {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h2 className="text-xl font-bold text-indigo-900 mb-4">Weekly Executive Report</h2>
            <p className="text-indigo-800 mb-4 font-medium">"What should HealthExpress change this week?"</p>
            <ul className="space-y-3 text-indigo-900/80 text-sm">
                <li className="flex gap-3">
                    <span className="text-indigo-500">1.</span>
                    <span>
                        <strong>Prioritize {quickWins[0]?.query || 'high-intent queries'}:</strong> It is sitting at position {quickWins[0]?.position.toFixed(1) || '11'} and receiving {quickWins[0]?.impressions || 'significant'} impressions. Update the title tag and H1 to capture this traffic.
                    </span>
                </li>
                <li className="flex gap-3">
                    <span className="text-indigo-500">2.</span>
                    <span>
                        <strong>Close the Content Gap for {gaps[0]?.query || 'new procedures'}:</strong> We are losing {gaps[0]?.impressions || 'many'} impressions because we do not have a dedicated high-quality page for this. Create a new page focused on {gaps[0]?.intent || 'patient needs'}.
                    </span>
                </li>
                <li className="flex gap-3">
                    <span className="text-indigo-500">3.</span>
                    <span>
                        <strong>Fix Cannibalization:</strong> {cannibalization.length} conflicting URLs detected. Keep separate pages clear by differentiating search intent. No automatic redirects have been applied.
                    </span>
                </li>
            </ul>
        </div>
    );
}
;

fs.writeFileSync(path.join(compDir, 'WeeklyReport.tsx'), reportCode);

