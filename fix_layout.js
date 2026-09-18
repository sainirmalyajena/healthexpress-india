const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/dashboard/leads/page.tsx', 'utf8');

const oldHeader = `<div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
                            <p className="text-sm text-slate-500">Track and manage patient inquiries from all channels.</p>
                        </div>
                        <div className="flex gap-3">
                            <AddLeadModal surgeries={surgeries} />
                            {session.role !== 'team' && <CSVUploader teamMembers={teamMembers} />}
                        </div>
                    </div>`;

const newHeader = `<div className="flex flex-col gap-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
                                <p className="text-sm text-slate-500">Track and manage patient inquiries from all channels.</p>
                            </div>
                            <AddLeadModal surgeries={surgeries} />
                        </div>
                        {session.role !== 'team' && (
                            <div className="max-w-4xl">
                                <CSVUploader teamMembers={teamMembers} />
                            </div>
                        )}
                    </div>`;

// Use a more robust replace that ignores exact whitespace if needed, or just standard replace
if (content.includes('Leads Management')) {
    // Just find the whole block manually
    const startIdx = content.indexOf('<div className="flex items-center justify-between mb-8">');
    const endIdx = content.indexOf('</div>\n\n                    \n                    \n                    {/* Filters */}');
    
    if (startIdx !== -1 && endIdx !== -1) {
        const toReplace = content.substring(startIdx, endIdx + 6);
        content = content.replace(toReplace, newHeader);
    }
}

fs.writeFileSync('src/app/[lang]/dashboard/leads/page.tsx', content);

let modalContent = fs.readFileSync('src/components/dashboard/AddLeadModal.tsx', 'utf8');
// Fix emoji
modalContent = modalContent.replace('<span>?</span>', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>');
fs.writeFileSync('src/components/dashboard/AddLeadModal.tsx', modalContent);
