const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/dashboard/leads/page.tsx', 'utf8');

const regex = /<div className="flex items-center justify-between mb-8">[\s\S]*?<div className="flex gap-3">\s*<AddLeadModal surgeries=\{surgeries\} \/>\s*\{session\.role !== 'team' && <CSVUploader teamMembers=\{teamMembers\} \/>\}\s*<\/div>\s*<\/div>/;

const newHeader = `<div className="flex flex-col gap-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Leads Management</h1>
                                <p className="text-sm text-slate-500">Track and manage patient inquiries from all channels.</p>
                            </div>
                            <AddLeadModal surgeries={surgeries} />
                        </div>
                        {session.role !== 'team' && (
                            <div className="w-full max-w-4xl">
                                <CSVUploader teamMembers={teamMembers} />
                            </div>
                        )}
                    </div>`;

content = content.replace(regex, newHeader);
fs.writeFileSync('src/app/[lang]/dashboard/leads/page.tsx', content);
