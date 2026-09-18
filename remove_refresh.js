const fs = require('fs');

let selectContent = fs.readFileSync('src/components/dashboard/LeadStatusSelect.tsx', 'utf8');
selectContent = selectContent.replace(/router\.refresh\(\);/g, '// router.refresh() removed for ultimate speed');
fs.writeFileSync('src/components/dashboard/LeadStatusSelect.tsx', selectContent);

let modalContent = fs.readFileSync('src/components/dashboard/CaseManagerModal.tsx', 'utf8');
modalContent = modalContent.replace(/router\.refresh\(\);/g, '// router.refresh() removed for ultimate speed');
fs.writeFileSync('src/components/dashboard/CaseManagerModal.tsx', modalContent);
