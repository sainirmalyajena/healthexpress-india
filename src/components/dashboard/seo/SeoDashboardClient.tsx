'use client';
import { useState } from 'react';
import QuickWinsTable from './QuickWinsTable';
import ContentGapsTable from './ContentGapsTable';
import WeeklyReport from './WeeklyReport';

export default function SeoDashboardClient({ rawData, opportunities }: { rawData: any[], opportunities: any[] }) {
    const [view, setView] = useState<'NON_BRAND' | 'BRAND'>('NON_BRAND');

    const isDemoMode = !process.env.NEXT_PUBLIC_LIVE_GSC;

    const filteredOpportunities = opportunities.filter(o => 
        view === 'BRAND' ? rawData.find(r => r.query === o.query)?.isBranded : !rawData.find(r => r.query === o.query)?.isBranded
    );

    const pos1to3 = filteredOpportunities.filter(o => o.type === 'TOP');
    const pos4to10 = filteredOpportunities.filter(o => o.type === 'NEAR_TOP');
    const pos11to20 = filteredOpportunities.filter(o => o.type === 'PAGE_2');
    const pos21to50 = filteredOpportunities.filter(o => o.type === 'GROWTH');
    const discovery = filteredOpportunities.filter(o => o.type === 'DISCOVERY');
    const gaps = filteredOpportunities.filter(o => o.type === 'GAP');
    const cannibalization = filteredOpportunities.filter(o => o.type === 'CANNIBALIZATION');

    const totalImpressions = rawData.filter(r => r.isBranded === (view === 'BRAND')).reduce((sum, r) => sum + r.impressions, 0);
    const totalClicks = rawData.filter(r => r.isBranded === (view === 'BRAND')).reduce((sum, r) => sum + r.clicks, 0);

    return (
        <div className="space-y-8">
            {isDemoMode && (
                <div className="bg-amber-100 border border-amber-300 text-amber-800 p-3 rounded-lg font-bold flex items-center justify-center shadow-sm">
                    ?? DEMO MODE: Showing AI-generated mock data. Connect Production GSC to view LIVE GSC DATA.
                </div>
            )}

            <div className="flex gap-4 border-b border-slate-200">
                <button 
                    onClick={() => setView('NON_BRAND')}
                    className={`py-2 px-4 border-b-2 font-medium transition-colors ${view === 'NON_BRAND' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Non-Branded SEO
                </button>
                <button 
                    onClick={() => setView('BRAND')}
                    className={`py-2 px-4 border-b-2 font-medium transition-colors ${view === 'BRAND' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
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

            <WeeklyReport 
                pos4to10={pos4to10} 
                pos11to20={pos11to20} 
                gaps={gaps} 
                cannibalization={cannibalization} 
            />

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Position 1-3 (Top Rankings)</h2>
                <QuickWinsTable opportunities={pos1to3} />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Position 4-10 (Near Top / Quick Wins)</h2>
                <QuickWinsTable opportunities={pos4to10} />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Position 11-20 (Page 2)</h2>
                <QuickWinsTable opportunities={pos11to20} />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Position 21-50 (Growth)</h2>
                <QuickWinsTable opportunities={pos21to50} />
            </div>
            
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Position 51+ (Discovery)</h2>
                <QuickWinsTable opportunities={discovery} />
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Content Gaps</h2>
                <ContentGapsTable opportunities={gaps} />
            </div>
        </div>
    );
}
