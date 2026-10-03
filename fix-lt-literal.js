const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'LeadsTable.tsx');
let content = fs.readFileSync(file, 'utf8');

// The file has literal "??" in it!
content = content.replace(/\?\? Export All CSV/g, '\uD83D\uDCC4 Export All CSV');
content = content.replace(/\?\? Export All Contacts/g, '\uD83D\uDCD7 Export All Contacts');

// Phone link has dY"z
content = content.replace(/dY"z/g, '\uD83D\uDCDE');
content = content.replace(/dY"z /g, '\uD83D\uDCDE ');

// Date strings might have weird characters?
content = content.replace(/dY"/g, '\uD83D\uDCE3');
content = content.replace(/dY -/g, '\uD83E\uDD16');
content = content.replace(/\?O/g, '\uD83D\uDEA8');
content = content.replace(/dY'/g, '\uD83D\uDCA1');
content = content.replace(/s,\?/g, '\u26A0\uFE0F');
content = content.replace(/,17\.50/g, '\u20B97.50');
content = content.replace(/,10/g, '\u20B910');
content = content.replace(/dY\+/g, '\uD83D\uDCE2');

fs.writeFileSync(file, content, 'utf8');
