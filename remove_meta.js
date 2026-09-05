const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', 'utf8');

content = content.replace(/export async function generateMetadata/g, '// export async function generateMetadata');

fs.writeFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', content, 'utf8');
