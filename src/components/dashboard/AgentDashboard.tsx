import { prisma } from '@/lib/prisma';
import LeadsTable from './LeadsTable';
import { LeadStatus } from '@/generated/prisma';

export default async function AgentDashboard({ userId, hospitals, statuses, teamMembers }: { userId: string, hospitals: any[], statuses: string[], teamMembers: any[] }) {
    
    // Get all active leads for this agent
    const leads = await prisma.lead.findMany({
        where: {
            assignedUserId: userId,
            status: { notIn: ['CLOSED', 'LOST'] }
        },
        include: { surgery: true, hospital: true },
        orderBy: { createdAt: 'desc' }
    });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Filter leads into buckets
    const uncontacted = leads.filter(l => l.status === 'NEW');
    
    const overdueFollowUps = leads.filter(l => 
        l.followUpDate && 
        new Date(l.followUpDate) < startOfToday &&
        !['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED'].includes(l.status)
    );

    const todaysFollowUps = leads.filter(l => 
        l.followUpDate && 
        new Date(l.followUpDate) >= startOfToday && 
        new Date(l.followUpDate) <= endOfToday
    );

    const todaysOPDs = leads.filter(l => 
        l.opdDate && 
        new Date(l.opdDate) >= startOfToday && 
        new Date(l.opdDate) <= endOfToday
    );

    const surgeriesBooked = leads.filter(l => l.status === 'SURGERY_SCHEDULED');

    return (
        <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h3 className="text-red-800 text-sm font-bold uppercase tracking-wider">Overdue</h3>
                    <p className="text-3xl font-black text-red-600 mt-2">{overdueFollowUps.length}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <h3 className="text-amber-800 text-sm font-bold uppercase tracking-wider">Today's Calls</h3>
                    <p className="text-3xl font-black text-amber-600 mt-2">{todaysFollowUps.length}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <h3 className="text-indigo-800 text-sm font-bold uppercase tracking-wider">OPDs Today</h3>
                    <p className="text-3xl font-black text-indigo-600 mt-2">{todaysOPDs.length}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <h3 className="text-emerald-800 text-sm font-bold uppercase tracking-wider">Surgeries Booked</h3>
                    <p className="text-3xl font-black text-emerald-600 mt-2">{surgeriesBooked.length}</p>
                </div>
            </div>

            {/* Task Queues */}
            {overdueFollowUps.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                        ?? Urgent: Overdue Follow-ups
                    </h2>
                    <LeadsTable leads={overdueFollowUps as any} hospitals={hospitals} statuses={statuses} teamMembers={teamMembers} />
                </div>
            )}

            {todaysFollowUps.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-amber-600 mb-4 flex items-center gap-2">
                        ?? Today's Scheduled Calls
                    </h2>
                    <LeadsTable leads={todaysFollowUps as any} hospitals={hospitals} statuses={statuses} teamMembers={teamMembers} />
                </div>
            )}

            {todaysOPDs.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                        ?? OPDs Arriving Today
                    </h2>
                    <LeadsTable leads={todaysOPDs as any} hospitals={hospitals} statuses={statuses} teamMembers={teamMembers} />
                </div>
            )}

            {uncontacted.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        ?? Uncontacted Fresh Leads
                    </h2>
                    <LeadsTable leads={uncontacted as any} hospitals={hospitals} statuses={statuses} teamMembers={teamMembers} />
                </div>
            )}

            {leads.length === 0 && (
                <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                    <span className="text-4xl block mb-4">??</span>
                    <h2 className="text-xl font-bold text-slate-800">Inbox Zero!</h2>
                    <p className="text-slate-500 mt-2">You have no active leads assigned right now. Great job!</p>
                </div>
            )}
        </div>
    );
}
