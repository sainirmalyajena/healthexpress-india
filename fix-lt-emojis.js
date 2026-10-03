const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'LeadsTable.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/dY"z/g, '\uD83D\uDCDE'); // Phone 📞
content = content.replace(/dY -/g, '\uD83E\uDD16'); // Robot 🤖
content = content.replace(/\?O/g, '\uD83D\uDEA8'); // Siren 🚨
content = content.replace(/dY'/g, '\uD83D\uDCA1'); // Bulb 💡
content = content.replace(/dY"/g, '\uD83D\uDCE3'); // Megaphone 📣
content = content.replace(/T,\?/g, '\uD83D\uDD04'); // Recycle 🔄
content = content.replace(/o\./g, 'o.'); // Reverting the bug accidentally introduced before

fs.writeFileSync(file, content, 'utf8');
