const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/dashboard/leads/[id]/page.tsx', 'utf8');

const statusesStr = `['NEW', 'CONTACTED', 'FOLLOW_UP', 'OPD_SCHEDULED', 'OPD_DONE', 'OPD_RESCHEDULE', 'SURGERY_SCHEDULED', 'SURGERY_DONE', 'SURGERY_RESCHEDULE', 'LOST', 'CLOSED']`;

content = content.replace(
    /<LeadStatusSelect\s*\n\s*leadId=\{lead\.id\}\s*\n\s*currentStatus=\{lead\.status\}\s*\/>/m,
    `<LeadStatusSelect\n                                leadId={lead.id}\n                                currentStatus={lead.status}\n                                statuses={${statusesStr}}\n                            />`
);

fs.writeFileSync('src/app/[lang]/dashboard/leads/[id]/page.tsx', content);
