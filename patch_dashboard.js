const fs = require('fs');

let content = fs.readFileSync('src/app/[lang]/dashboard/page.tsx', 'utf8');

// 1. Add import for AgentDashboard
content = content.replace(/import DashboardShell from '@\/components\/dashboard\/DashboardShell';/, "import DashboardShell from '@/components/dashboard/DashboardShell';\nimport AgentDashboard from '@/components/dashboard/AgentDashboard';\nimport { LeadStatus } from '@/generated/prisma';");

// 2. Replace the team redirect with AgentDashboard render
const replacement = `if (session.role === 'team') {
        const statuses = Object.values(LeadStatus);
        const hospitals = await prisma.hospital.findMany();
        const teamMembers = await prisma.user.findMany({ select: { id: true, name: true, email: true }, orderBy: { name: 'asc' } });
        return (
            <DashboardShell userName={session.name || 'Team Member'} userRole="team">
                <div className="p-8 max-w-7xl mx-auto">
                    <h1 className="text-3xl font-black text-slate-800 mb-2">My Action Dashboard</h1>
                    <p className="text-slate-500 mb-8">Focus on what needs your attention today.</p>
                    <AgentDashboard 
                        userId={session.adminId} 
                        hospitals={hospitals} 
                        statuses={statuses} 
                        teamMembers={teamMembers} 
                    />
                </div>
            </DashboardShell>
        );
    }`;

content = content.replace(/if \(session\.role === 'team'\) \{\s*redirect\(.*?\);\s*\}/, replacement);

fs.writeFileSync('src/app/[lang]/dashboard/page.tsx', content, 'utf8');
console.log('Modified dashboard page');
