const fs = require('fs');
let content = fs.readFileSync('next.config.ts', 'utf8');
content = content.replace(/remotePatterns: \[/, "qualities: [60, 75, 90],\n    remotePatterns: [");
fs.writeFileSync('next.config.ts', content, 'utf8');
