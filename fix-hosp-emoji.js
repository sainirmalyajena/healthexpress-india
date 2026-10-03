const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', '[lang]', 'dashboard', 'hospitals', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\?\?\? View on Maps/g, '\uD83D\uDDFA\uFE0F View on Maps');
fs.writeFileSync(file, content, 'utf8');
