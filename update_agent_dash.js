const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/AgentDashboard.tsx', 'utf8');

content = content.replace(
    /new Date\(l\.followUpDate\) < startOfToday &&/g,
    `new Date(l.followUpDate) < now &&`
);

// Add a metric for "OPDs Booked Today"
// Let's add it in the KPI Cards grid
const kpiSearch = `<h3 className="text-red-800 text-sm font-bold uppercase tracking-wider">Overdue</h3>`;

const newKpi = `
                <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <h3 className="text-teal-800 text-sm font-bold uppercase tracking-wider">OPDs Booked (Today)</h3>
                    <p className="text-3xl font-black text-teal-600 mt-2">
                        {leads.filter(l => l.status === 'OPD_SCHEDULED' && new Date(l.updatedAt) >= startOfToday).length}
                    </p>
                </div>
`;

if (!content.includes('OPDs Booked (Today)')) {
    content = content.replace(
        /<div className="bg-red-50 p-4 rounded-xl border border-red-100">/m,
        `${newKpi}\n                <div className="bg-red-50 p-4 rounded-xl border border-red-100">`
    );
}

fs.writeFileSync('src/components/dashboard/AgentDashboard.tsx', content);
