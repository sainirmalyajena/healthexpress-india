const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/LeadsTable.tsx', 'utf8');

// 1. Fix handleDelete
code = code.replace(
    /const handleAiCall = async \(lead: Lead\) => \{[\s\S]*?alert\('An error occurred while deleting\.'\);\s*\}\s*\};/,
    `const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            const res = await fetch(\`/api/dashboard/leads/\${id}\`, { method: 'DELETE' });
            if (res.ok) {
                setLocalLeads(prev => prev.filter(l => l.id !== id));
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete lead');
            }
        } catch (error) {
            console.error('Failed to delete lead:', error);
            alert('An error occurred while deleting.');
        }
    };`
);

// 2. Wire onUpdate to LeadStatusSelect
code = code.replace(
    `<LeadStatusSelect
                                                        leadId={lead.id}
                                                        currentStatus={lead.status || 'NEW'}
                                                        statuses={statuses}
                                                    />`,
    `<LeadStatusSelect
                                                        leadId={lead.id}
                                                        currentStatus={lead.status || 'NEW'}
                                                        statuses={statuses}
                                                        onUpdate={(newStatus) => setLocalLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l))}
                                                    />`
);

// 3. Wire onUpdate to CaseManagerModal
code = code.replace(
    `<CaseManagerModal
                    lead={selectedLead}
                    hospitals={hospitals} teamMembers={teamMembers}
                    onClose={() => setSelectedLead(null)}
                />`,
    `<CaseManagerModal
                    lead={selectedLead}
                    hospitals={hospitals}
                    teamMembers={teamMembers}
                    onUpdate={handleModalUpdate}
                    onClose={() => setSelectedLead(null)}
                />`
);

// 4. Add contentVisibility: 'auto' to <tr> for 60fps scrolling
code = code.replace(
    `<tr key={lead.id} className={\`transition-colors \${selectedLeads.includes(lead.id) ? 'bg-teal-50/30' : 'hover:bg-slate-50'}\`}>`,
    `<tr key={lead.id} style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 72px' }} className={\`transition-colors \${selectedLeads.includes(lead.id) ? 'bg-teal-50/30' : 'hover:bg-slate-50'}\`}>`
);

fs.writeFileSync('src/components/dashboard/LeadsTable.tsx', code, 'utf8');
console.log('✅ LeadsTable updated successfully!');
