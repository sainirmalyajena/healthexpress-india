const fs = require('fs');
let code = fs.readFileSync('src/app/[lang]/dashboard/page.tsx', 'utf8');

// 1. Add TeamLeaderboard and helper imports
code = code.replace(
    `import OpdScheduleWidget from '@/components/dashboard/OpdScheduleWidget';`,
    `import OpdScheduleWidget from '@/components/dashboard/OpdScheduleWidget';\nimport TeamLeaderboard from '@/components/dashboard/TeamLeaderboard';`
);

code = code.replace(
    `import { getISTDayRange } from '@/lib/utils';`,
    `import { getISTDayRange, getISTPeriodRanges, formatWhatsAppPhone, generateOpdWhatsAppMessage } from '@/lib/utils';`
);

// 2. Add period ranges
code = code.replace(
    `const { startOfToday, endOfToday } = getISTDayRange(now);`,
    `const { startOfToday, endOfToday, startOfWeek, startOfMonth } = getISTPeriodRanges();`
);

// 3. Update urgentLeads query
code = code.replace(
    /prisma\.lead\.findMany\(\{\s*where:\s*\{\s*\.\.\.whereClause,\s*status:\s*\{\s*notIn:\s*\['OPD_DONE',\s*'SURGERY_DONE',\s*'SURGERY_SCHEDULED',\s*'CLOSED',\s*'LOST'\]\s*\},\s*followUpDate:\s*\{\s*lt:\s*now\s*\}\s*\},\s*take:\s*5,\s*orderBy:\s*\{\s*followUpDate:\s*'asc'\s*\},\s*include:\s*\{\s*assignedUser:\s*true,\s*hospital:\s*true\s*\}\s*\}\)/,
    `prisma.lead.findMany({
            where: { ...whereClause, status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] }, followUpDate: { not: null, lte: endOfToday } },
            take: 6,
            orderBy: { followUpDate: 'desc' },
            include: { assignedUser: true, hospital: true, surgery: { select: { name: true } } }
        })`
);

// 4. Update team performance calculation
const oldTeamPerfRegex = /\/\/ Team Leaderboard \(Only for Admin\)[\s\S]*?let teamPerformance:[\s\S]*?\}\.slice\(0, 4\);\s*\}/;
const newTeamStatsCode = `// Team Leaderboard & Workload (For Admin)
    let teamStats: any[] = [];
    if (session.role !== 'team') {
        const users = await prisma.user.findMany({
            where: { role: 'team' },
            include: {
                assignedLeads: {
                    select: {
                        id: true,
                        status: true,
                        opdDate: true,
                        followUpDate: true,
                        revenue: true,
                        discountedCost: true
                    }
                }
            }
        });

        teamStats = users.map(user => {
            const leads = user.assignedLeads;
            const activeLeads = leads.filter(l => !['CLOSED', 'LOST'].includes(l.status)).length;
            
            const todayOpds = leads.filter(l => 
                ['OPD_SCHEDULED', 'OPD_DONE', 'SURGERY_SUGGESTED', 'SURGERY_SCHEDULED', 'SURGERY_DONE'].includes(l.status) &&
                l.opdDate && l.opdDate >= startOfToday && l.opdDate <= endOfToday
            ).length;

            const weekOpds = leads.filter(l => 
                ['OPD_SCHEDULED', 'OPD_DONE', 'SURGERY_SUGGESTED', 'SURGERY_SCHEDULED', 'SURGERY_DONE'].includes(l.status) &&
                l.opdDate && l.opdDate >= startOfWeek && l.opdDate <= endOfToday
            ).length;

            const monthOpds = leads.filter(l => 
                ['OPD_SCHEDULED', 'OPD_DONE', 'SURGERY_SUGGESTED', 'SURGERY_SCHEDULED', 'SURGERY_DONE'].includes(l.status) &&
                l.opdDate && l.opdDate >= startOfMonth && l.opdDate <= endOfToday
            ).length;

            const surgeriesDone = leads.filter(l => l.status === 'SURGERY_DONE').length;
            const surgeryRevenue = leads.filter(l => l.status === 'SURGERY_DONE').reduce((sum, l) => sum + (l.revenue || l.discountedCost || 0), 0);
            
            const overdueFollowUps = leads.filter(l => 
                !['CLOSED', 'LOST', 'SURGERY_DONE'].includes(l.status) &&
                l.followUpDate && l.followUpDate < now
            ).length;

            const onTimeRate = activeLeads > 0 ? Math.max(0, Math.round(((activeLeads - overdueFollowUps) / activeLeads) * 100)) : 100;

            return {
                id: user.id,
                name: user.name,
                initials: user.name.slice(0, 2).toUpperCase(),
                todayOpds,
                weekOpds,
                monthOpds,
                surgeriesDone,
                surgeryRevenue,
                activeLeads,
                overdueFollowUps,
                onTimeRate
            };
        });
    }`;

code = code.replace(oldTeamPerfRegex, newTeamStatsCode);

// 5. Update bottom row rendering
const oldBottomRowRegex = /\{\/\* Secondary Grid \(Bottom Row\) \*\/\}[\s\S]*?<\/DashboardShell>/;
const newBottomRowCode = `{/* Secondary Grid (Bottom Row) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Actionable Follow-ups Queue */}
                    <div className={\`bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col \${session.role !== 'team' ? 'lg:col-span-7' : 'lg:col-span-12'}\`}>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 leading-tight">Calling Action Queue</h2>
                                    <p className="text-xs text-slate-500">Scheduled follow-ups needing immediate call</p>
                                </div>
                            </div>
                            <Link href={\`/\${lang}/dashboard/leads?quickFilter=today_followups\`} className="text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl transition">
                                View All Due →
                            </Link>
                        </div>
                        
                        {urgentLeads.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 my-auto">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20 text-teal-600" />
                                <p className="font-semibold text-slate-600">All follow-ups completed!</p>
                                <p className="text-xs text-slate-400 mt-1">No pending calls due right now.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-50/80 border-y border-slate-100">
                                        <tr>
                                            <th className="px-3.5 py-3 font-bold rounded-tl-xl">Patient</th>
                                            <th className="px-3.5 py-3 font-bold">Treatment & City</th>
                                            <th className="px-3.5 py-3 font-bold">Scheduled Time</th>
                                            {session.role !== 'team' && <th className="px-3.5 py-3 font-bold">Assigned</th>}
                                            <th className="px-3.5 py-3 font-bold text-right rounded-tr-xl">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {urgentLeads.map((lead) => {
                                            const formattedPhone = formatWhatsAppPhone(lead.phone);
                                            const waMsg = encodeURIComponent(\`Hi \${lead.fullName}, this is HealthExpress regarding your inquiry for \${lead.surgery?.name || 'medical consultation'}. We are reaching out for your scheduled follow-up. Please let us know a good time to speak.\`);
                                            
                                            return (
                                                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="px-3.5 py-3.5">
                                                        <p className="font-bold text-slate-900">{lead.fullName}</p>
                                                        <a href={\`tel:\${lead.phone}\`} className="text-xs text-teal-600 hover:underline font-medium">📞 {lead.phone}</a>
                                                    </td>
                                                    <td className="px-3.5 py-3.5">
                                                        <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md">
                                                            {lead.surgery?.name || 'Consultation'}
                                                        </span>
                                                        {lead.city && (
                                                            <p className="text-[11px] text-slate-400 mt-0.5">{lead.city}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-3.5 py-3.5">
                                                        <span className="text-xs font-bold text-rose-600 block">
                                                            {lead.followUpDate ? new Date(lead.followUpDate).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : 'N/A'}
                                                        </span>
                                                    </td>
                                                    {session.role !== 'team' && (
                                                        <td className="px-3.5 py-3.5 text-xs text-slate-600 font-medium">
                                                            {lead.assignedUser?.name || <span className="text-slate-400 italic">Unassigned</span>}
                                                        </td>
                                                    )}
                                                    <td className="px-3.5 py-3.5 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <a
                                                                href={\`tel:\${lead.phone}\`}
                                                                className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg text-xs font-bold hover:bg-teal-100 transition-colors inline-flex items-center gap-1"
                                                            >
                                                                📞 Call
                                                            </a>
                                                            <a
                                                                href={\`https://wa.me/\${formattedPhone}?text=\${waMsg}\`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                                                                title="Send WhatsApp Follow-up"
                                                            >
                                                                💬 WA
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* High-Impact Team Leaderboard & Workload Balancer */}
                    {session.role !== 'team' && (
                        <div className="lg:col-span-5 flex flex-col">
                            <TeamLeaderboard
                                teamStats={teamStats}
                                userRole={session.role}
                                lang={lang}
                            />
                        </div>
                    )}
                    
                </div>
            </div>
        </DashboardShell>`;

code = code.replace(oldBottomRowRegex, newBottomRowCode);

fs.writeFileSync('src/app/[lang]/dashboard/page.tsx', code, 'utf8');
console.log('✅ Dashboard page successfully updated with TeamLeaderboard and Calling Action Queue!');
