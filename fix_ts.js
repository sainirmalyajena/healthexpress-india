const fs = require('fs');
let content1 = fs.readFileSync('scripts/create-test-patient.ts', 'utf8');
content1 = content1.replace(/status: 'SCHEDULED'/g, "status: 'OPD_SCHEDULED'");
fs.writeFileSync('scripts/create-test-patient.ts', content1, 'utf8');

let content2 = fs.readFileSync('src/app/[lang]/partner/dashboard/page.tsx', 'utf8');
content2 = content2.replace(/status === 'COMPLETED'/g, "status === 'SURGERY_DONE'");
fs.writeFileSync('src/app/[lang]/partner/dashboard/page.tsx', content2, 'utf8');
