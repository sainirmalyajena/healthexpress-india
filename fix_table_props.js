const fs = require('fs');
let tableContent = fs.readFileSync('src/components/dashboard/LeadsTable.tsx', 'utf8');

tableContent = tableContent.replace(
    /<LeadStatusSelect\s+leadId=\{lead\.id\}\s+currentStatus=\{lead\.status \|\| 'NEW'\}\s+onUpdate=\{\(s\) => handleStatusUpdate\(lead\.id, s\)\}\s*\/>/g,
    `<LeadStatusSelect leadId={lead.id} currentStatus={lead.status || 'NEW'} statuses={statuses} onUpdate={(s) => handleStatusUpdate(lead.id, s)} />`
);

fs.writeFileSync('src/components/dashboard/LeadsTable.tsx', tableContent);
