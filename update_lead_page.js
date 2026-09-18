const fs = require('fs');

let content = fs.readFileSync('src/app/[lang]/dashboard/leads/[id]/page.tsx', 'utf8');

// 1. Update getLeadDetail to include activityLogs and assignedUser
content = content.replace(
    /include: \{\s*surgery: true,\s*hospital: true\s*\}/,
    `include: {
            surgery: true,
            hospital: true,
            assignedUser: true,
            activityLogs: {
                include: { user: true },
                orderBy: { createdAt: 'desc' }
            }
        }`
);

// 2. Add "Schedule & Activity Timeline" UI in the left column (after Marketing Context)
const timelineHtml = `
                        {/* Timeline & Activity */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span>??</span> Activity Timeline
                                </h3>
                            </div>
                            <div className="p-6">
                                {(!lead.activityLogs || lead.activityLogs.length === 0) ? (
                                    <p className="text-sm text-slate-500 italic">No activity recorded yet.</p>
                                ) : (
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                        {lead.activityLogs.map((log: any, i: number) => {
                                            let icon = "??";
                                            if (log.actionType === 'STATUS_CHANGED') icon = "??";
                                            if (log.actionType === 'LEAD_ASSIGNED') icon = "??";
                                            
                                            return (
                                                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                        {icon}
                                                    </div>
                                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border border-slate-100 shadow-sm">
                                                        <div className="flex items-center justify-between space-x-2 mb-1">
                                                            <div className="font-bold text-slate-900 text-sm">{log.actionType.replace('_', ' ')}</div>
                                                            <time className="text-xs text-slate-500 font-medium">{new Date(log.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</time>
                                                        </div>
                                                        <div className="text-sm text-slate-600">
                                                            {log.details ? (
                                                                <span className="italic">{log.details.replace(/"/g, '')}</span>
                                                            ) : 'Action performed'}
                                                            <div className="text-xs text-slate-400 mt-2">By: {log.user?.name || 'System'}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
`;
content = content.replace(/<\/div>\s*\{\/\* Right Column: Financials \& Admin Controls \*\/\}/, timelineHtml + '\n                        {/* Right Column: Financials & Admin Controls */}');

// 3. Add Dates to Case Economics / Right Column
const datesHtml = `
                                    <div className="pt-4 border-t border-slate-100 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium">Assigned To</span>
                                            <span className="font-bold text-slate-900">{lead.assignedUser?.name || 'Unassigned'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium">OPD Date</span>
                                            <span className="font-bold text-teal-700">
                                                {lead.opdDate ? new Date(lead.opdDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'Not set'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium">Next Follow-up</span>
                                            <span className="font-bold text-orange-600">
                                                {lead.followUpDate ? new Date(lead.followUpDate).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }) : 'Not set'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
`;
content = content.replace(/<div className="pt-4 border-t border-slate-100">\s*<p className="text-xs font-bold text-slate-400 uppercase mb-3">Ops Team \n?Notes<\/p>/, datesHtml + '                                        <p className="text-xs font-bold text-slate-400 uppercase mb-3">Ops Team Notes</p>');

fs.writeFileSync('src/app/[lang]/dashboard/leads/[id]/page.tsx', content);
