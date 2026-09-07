const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/dashboard/leads/page.tsx', 'utf8');

// Add lucide-react imports
if (!content.includes('import { Activity')) {
    content = content.replace(
        /import Link from 'next\/link';/,
        `import Link from 'next/link';\nimport { Activity, AlertTriangle, PhoneCall, Calendar, UserPlus } from 'lucide-react';`
    );
}

// Add quickFilter to SearchParams
if (!content.includes('quickFilter?: string;')) {
    content = content.replace(
        /interface SearchParams \{/,
        `interface SearchParams {\n    quickFilter?: string;`
    );
}

// Update getLeads where logic
const updatedGetLeads = `
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (searchParams.quickFilter) {
        if (searchParams.quickFilter === 'uncontacted') {
            where.status = 'NEW';
        } else if (searchParams.quickFilter === 'overdue') {
            where.status = { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] };
            where.followUpDate = { lt: now };
        } else if (searchParams.quickFilter === 'today_followups') {
            where.status = { notIn: ['CLOSED', 'LOST'] };
            where.followUpDate = { gte: startOfToday, lte: endOfToday };
        } else if (searchParams.quickFilter === 'today_opds') {
            where.opdDate = { gte: startOfToday, lte: endOfToday };
        }
    }
`;
if (!content.includes('searchParams.quickFilter')) {
    content = content.replace(
        /if \(searchParams\.query\) \{/,
        `${updatedGetLeads}\n    if (searchParams.query) {`
    );
}

// Replace the stats logic
const statsLogic = `
    let uncontactedCount = 0;
    let overdueFollowUps = 0;
    let todaysFollowUps = 0;
    let todaysOpds = 0;

    if (session) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const whereClause = session.role === 'team' ? { assignedUserId: session.adminId } : {};
        
        uncontactedCount = await prisma.lead.count({
            where: { ...whereClause, status: 'NEW' }
        });

        overdueFollowUps = await prisma.lead.count({
            where: {
                ...whereClause,
                status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] },
                followUpDate: { lt: now }
            }
        });

        todaysFollowUps = await prisma.lead.count({
            where: {
                ...whereClause,
                status: { notIn: ['CLOSED', 'LOST'] },
                followUpDate: { gte: startOfToday, lte: endOfToday }
            }
        });
        
        todaysOpds = await prisma.lead.count({
            where: {
                ...whereClause,
                opdDate: { gte: startOfToday, lte: endOfToday }
            }
        });
    }
`;

content = content.replace(/let opdsBookedToday = 0;[\s\S]*?(?=const \{ leads, total, totalPages \} = data;)/, statsLogic);

// Replace the stats UI
const statsUI = `
                    {/* Quick Stats Banner */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Link href={\`/\${lang}/dashboard/leads?quickFilter=uncontacted\`} className={\`bg-blue-50 hover:bg-blue-100 transition-colors rounded-xl p-4 border \${searchParamsData.quickFilter === 'uncontacted' ? 'border-blue-400 ring-2 ring-blue-200' : 'border-blue-100'} flex items-center justify-between\`}>
                            <div>
                                <p className="text-blue-800 text-xs font-bold uppercase tracking-wider">New Leads</p>
                                <p className="text-2xl font-black text-blue-600 mt-1">{uncontactedCount}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><UserPlus className="w-5 h-5" /></div>
                        </Link>

                        <Link href={\`/\${lang}/dashboard/leads?quickFilter=overdue\`} className={\`bg-red-50 hover:bg-red-100 transition-colors rounded-xl p-4 border \${searchParamsData.quickFilter === 'overdue' ? 'border-red-400 ring-2 ring-red-200' : 'border-red-100'} flex items-center justify-between\`}>
                            <div>
                                <p className="text-red-800 text-xs font-bold uppercase tracking-wider">Overdue</p>
                                <p className="text-2xl font-black text-red-600 mt-1">{overdueFollowUps}</p>
                            </div>
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600"><AlertTriangle className="w-5 h-5" /></div>
                        </Link>
                        
                        <Link href={\`/\${lang}/dashboard/leads?quickFilter=today_followups\`} className={\`bg-amber-50 hover:bg-amber-100 transition-colors rounded-xl p-4 border \${searchParamsData.quickFilter === 'today_followups' ? 'border-amber-400 ring-2 ring-amber-200' : 'border-amber-100'} flex items-center justify-between\`}>
                            <div>
                                <p className="text-amber-800 text-xs font-bold uppercase tracking-wider">Today's Calls</p>
                                <p className="text-2xl font-black text-amber-600 mt-1">{todaysFollowUps}</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600"><PhoneCall className="w-5 h-5" /></div>
                        </Link>
                        
                        <Link href={\`/\${lang}/dashboard/leads?quickFilter=today_opds\`} className={\`bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-xl p-4 border \${searchParamsData.quickFilter === 'today_opds' ? 'border-indigo-400 ring-2 ring-indigo-200' : 'border-indigo-100'} flex items-center justify-between\`}>
                            <div>
                                <p className="text-indigo-800 text-xs font-bold uppercase tracking-wider">Today's OPDs</p>
                                <p className="text-2xl font-black text-indigo-600 mt-1">{todaysOpds}</p>
                            </div>
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"><Calendar className="w-5 h-5" /></div>
                        </Link>
                    </div>
`;

content = content.replace(/\{\/\* Quick Stats Banner \*\/\}[\s\S]*?(?=\{\/\* Filters \*\/)/, statsUI);

fs.writeFileSync('src/app/[lang]/dashboard/leads/page.tsx', content);
