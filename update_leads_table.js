const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/LeadsTable.tsx', 'utf8');

// Replace Header
content = content.replace(
    /<th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reference<\/th>/,
    `<th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date Added</th>`
);

// Replace Cell Content
content = content.replace(
    /<span className="font-mono text-xs text-slate-600">\{lead\.referenceId\}<\/span>/,
    `<span className="text-xs text-slate-600 font-medium whitespace-nowrap">{new Date(lead.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}</span>`
);

fs.writeFileSync('src/components/dashboard/LeadsTable.tsx', content);
