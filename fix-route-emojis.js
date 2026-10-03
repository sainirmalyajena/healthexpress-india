const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', 'api', 'webhooks', 'meta-leads', 'route.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/dY\+/g, '\uD83D\uDCE2'); // Megaphone 📢
content = content.replace(/dY"/g, '\uD83D\uDCE3'); // Megaphone 📣
content = content.replace(/\?\?/g, '\u2705'); // Check ✅

fs.writeFileSync(file, content, 'utf8');
