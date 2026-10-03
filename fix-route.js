const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', 'api', 'dashboard', 'hospitals', 'route.ts');
let content = fs.readFileSync(file, 'utf8');

content = content.replace("body.email ? dr.+body.email : ''", "body.email ? 'dr.'+body.email : ''");

fs.writeFileSync(file, content, 'utf8');
