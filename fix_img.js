const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', 'utf8');
content = content.replace(/quality=\{60\}/g, "quality={75}");
fs.writeFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', content, 'utf8');
