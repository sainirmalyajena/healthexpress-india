const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', 'api', 'webhooks', 'meta-leads', 'route.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/thirtyDaysAg\u2705setDate/g, 'thirtyDaysAgo.setDate');
content = content.replace(/thirtyDaysAg\u2705getDate/g, 'thirtyDaysAgo.getDate');

// Check if any other "o." got replaced incorrectly
content = content.replace(/c\u2705ns/g, 'cons');
content = content.replace(/t\u2705/g, 'to.');

fs.writeFileSync(file, content, 'utf8');
