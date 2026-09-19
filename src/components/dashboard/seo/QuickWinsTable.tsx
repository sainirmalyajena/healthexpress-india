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
                        {opportunities.map((opp: any) => {
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
                                    <td className="p-4 text-slate-600">{opp.position?.toFixed(1)}</td>
                                    <td className="p-4 text-slate-600">{opp.impressions?.toLocaleString()}</td>
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
