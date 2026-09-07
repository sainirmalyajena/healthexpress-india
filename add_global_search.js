const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/DashboardShell.tsx', 'utf8');

const searchForm = `
                <div className="px-4 py-2">
                    <form action="/dashboard/leads" method="GET" className="relative">
                        <input 
                            type="text" 
                            name="query" 
                            placeholder="Find lead by phone..." 
                            className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-teal-500 transition-all"
                        />
                        <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </form>
                </div>
`;

content = content.replace(
    /<nav className="flex-1 p-4 space-y-1">/,
    `${searchForm}\n                <nav className="flex-1 px-4 pb-4 space-y-1">`
);

fs.writeFileSync('src/components/dashboard/DashboardShell.tsx', content);
