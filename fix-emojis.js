const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'CaseManagerModal.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace('dY"z', '📞');
content = content.replace('âœ•', '✕');
content = content.replace('â‚¹', '₹');
content = content.replace('?"', '—'); // '—' em-dash

fs.writeFileSync(file, content, 'utf8');
