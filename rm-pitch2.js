const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'CaseManagerModal.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /\{hospitalId && hospitals\.find\(h => h\.id === hospitalId\) && \([\s\S]*?\)\}\n/;
content = content.replace(regex, '');

fs.writeFileSync(file, content, 'utf8');
console.log('Removed Pitch Details block');
