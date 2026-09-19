export default function QuickWinsTable({ opportunities }: { opportunities: any[] }) {
    if (!opportunities.length) return <p className="text-slate-500">No opportunities found in this category.</p>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                            <th className="p-4 font-semibold">Query & Intent</th>
                            <th className="p-4 font-semibold">Score</th>
                            <th className="p-4 font-semibold">Metrics</th>
                            <th className="p-4 font-semibold">AI Recommendation</th>
                            <th className="p-4 font-semibold">Approval</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {opportunities.map((opp: any) => {
                            const rec = JSON.parse(opp.recommendation || '{}');
                            return (
                                <tr key={opp.id} className="hover:bg-slate-50">
                                    <td className="p-4 align-top">
                                        <div className="font-medium text-slate-900">{opp.query}</div>
                                        <div className="text-xs text-slate-500 mt-1">{opp.intent}</div>
                                        <div className="text-xs text-slate-500">{opp.businessCapability || 'Unknown Cap'}</div>
                                        {opp.revenueIntent && (
                                            <span className="inline-flex mt-2 items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                                {opp.revenueIntent} REVENUE
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="text-lg font-bold text-slate-800">{opp.score}</div>
                                        {opp.trendStatus && (
                                            <div className={\	ext-xs mt-1 font-medium \\}>
                                                {opp.trendStatus}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 align-top text-xs text-slate-600 space-y-1">
                                        <div><strong>Pos:</strong> {opp.position?.toFixed(1)}</div>
                                        <div><strong>Imp:</strong> {opp.impressions?.toLocaleString()}</div>
                                        <div><strong>URL:</strong> <span className="text-slate-400 truncate w-32 inline-block align-bottom" title={opp.landingPage}>{opp.landingPage}</span></div>
                                    </td>
                                    <td className="p-4 align-top max-w-sm">
                                        <div className="text-xs text-slate-600 space-y-2">
                                            <div className="flex gap-2">
                                                <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold uppercase">{rec.action}</span>
                                            </div>
                                            <p><strong className="text-slate-800">Title:</strong> {rec.title}</p>
                                            <p><strong className="text-slate-800">H1:</strong> {rec.h1}</p>
                                            <p><strong className="text-slate-800">Sections:</strong> {rec.contentSections?.join(', ')}</p>
                                            <p><strong className="text-slate-800">CTA:</strong> {rec.cta}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="flex flex-col gap-2">
                                            {opp.status === 'OPEN' ? (
                                                <>
                                                    <button className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded shadow-sm hover:bg-green-700">Approve</button>
                                                    <button className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded border border-red-200 hover:bg-red-100">Reject</button>
                                                    <button className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded border border-slate-200 hover:bg-slate-200">Edit</button>
                                                </>
                                            ) : (
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase text-center border border-slate-200">
                                                    {opp.status}
                                                </span>
                                            )}
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
