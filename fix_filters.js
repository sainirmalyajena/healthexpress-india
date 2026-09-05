const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/dashboard/leads/page.tsx', 'utf8');

// 1. Add assignedUserId to SearchParams
content = content.replace(/status\?: string;/, 'status?: string;\n    assignedUserId?: string;');

// 2. Add assignedUserId filter logic in getLeads
content = content.replace(/if \(searchParams\.city\)/, `if (role !== 'team' && searchParams.assignedUserId) {
        if (searchParams.assignedUserId === 'unassigned') {
            where.assignedUserId = null;
        } else {
            where.assignedUserId = searchParams.assignedUserId;
        }
    }

    if (searchParams.city)`);

// 3. Fix form action
content = content.replace(/<form action=\"\/dashboard\/leads\"/, '<form action={`/${lang}/dashboard/leads`}');

// 4. Make room in the grid and add Assigned To dropdown
content = content.replace(/className=\"grid grid-cols-1 md:grid-cols-4 gap-4\"/, 'className="grid grid-cols-1 md:grid-cols-5 gap-4"');

const assignedDropdown = `
                            {session.role !== 'team' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned To</label>
                                    <select
                                        name="assignedUserId"
                                        defaultValue={searchParamsData.assignedUserId || ''}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                                    >
                                        <option value="">All Members</option>
                                        <option value="unassigned">-- Unassigned --</option>
                                        {teamMembers.map((member) => (
                                            <option key={member.id} value={member.id}>{member.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
`;

content = content.replace(/<div>\s*<label className=\"block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2\">City<\/label>/, assignedDropdown + '\n                            <div>\n                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>');

fs.writeFileSync('src/app/[lang]/dashboard/leads/page.tsx', content, 'utf8');
