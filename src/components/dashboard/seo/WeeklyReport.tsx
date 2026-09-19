export default function WeeklyReport({ quickWins, gaps, cannibalization }: { quickWins: any[], gaps: any[], cannibalization: any[] }) {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
            <h2 className="text-xl font-bold text-indigo-900 mb-4">Weekly Executive Report</h2>
            <p className="text-indigo-800 mb-4 font-medium">"What should HealthExpress change this week?"</p>
            <ul className="space-y-3 text-indigo-900/80 text-sm">
                <li className="flex gap-3">
                    <span className="text-indigo-500">1.</span>
                    <span>
                        <strong>Prioritize {quickWins[0]?.query || 'high-intent queries'}:</strong> It is sitting at position {quickWins[0]?.position?.toFixed(1) || '11'} and receiving {quickWins[0]?.impressions || 'significant'} impressions. Update the title tag and H1 to capture this traffic.
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
