const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/dashboard/leads/page.tsx', 'utf8');

// We need to calculate these stats in getLeads or in the main component.
// Let's add them to the main component try/catch block.
const statsLogic = `
    let opdsBookedToday = 0;
    let overdueFollowUps = 0;
    let todaysFollowUps = 0;

    if (session) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        // Calculate stats for the user (or team if admin)
        const whereClause: Prisma.LeadWhereInput = session.role === 'team' ? { assignedUserId: session.adminId } : {};
        
        opdsBookedToday = await prisma.lead.count({
            where: {
                ...whereClause,
                status: 'OPD_SCHEDULED',
                updatedAt: { gte: startOfToday }
            }
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
    }
`;

content = content.replace(
    /const \{\s*leads,\s*total,\s*totalPages\s*\} = data;/,
    `${statsLogic}\n    const { leads, total, totalPages } = data;`
);

const statsUI = `
                    {/* Quick Stats Banner */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100 flex items-center justify-between">
                            <div>
                                <p className="text-teal-800 text-xs font-bold uppercase tracking-wider">OPDs Booked (Today)</p>
                                <p className="text-2xl font-black text-teal-600 mt-1">{opdsBookedToday}</p>
                            </div>
                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xl">??</div>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100 flex items-center justify-between">
                            <div>
                                <p className="text-red-800 text-xs font-bold uppercase tracking-wider">Overdue Follow-ups</p>
                                <p className="text-2xl font-black text-red-600 mt-1">{overdueFollowUps}</p>
                            </div>
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl">??</div>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-center justify-between">
                            <div>
                                <p className="text-amber-800 text-xs font-bold uppercase tracking-wider">Today's Follow-ups</p>
                                <p className="text-2xl font-black text-amber-600 mt-1">{todaysFollowUps}</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xl">??</div>
                        </div>
                    </div>
`;

content = content.replace(
    /\{\/\* Filters \*\/\}/,
    `${statsUI}\n\n                    {/* Filters */}`
);

fs.writeFileSync('src/app/[lang]/dashboard/leads/page.tsx', content);
