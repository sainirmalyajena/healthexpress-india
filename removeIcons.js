const fs = require('fs');
const path = 'src/app/[lang]/layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// Regex to remove icons: { ... } block
content = content.replace(/icons:\s*\{[\s\S]*?apple:\s*\[[\s\S]*?\]\s*\},/, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Removed manual icons metadata');
