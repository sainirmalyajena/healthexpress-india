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
                        {opportunities.map((opp: any) => {
                            const rec = JSON.parse(opp.recommendation || '{}');
                            return (
                                <tr key={opp.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-900">{opp.query}</td>
                                    <td className="p-4 text-slate-600">{opp.intent}</td>
                                    <td className="p-4 text-slate-600">{opp.impressions?.toLocaleString()}</td>
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
