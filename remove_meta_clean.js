const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', 'utf8');

// Replace the entire generateMetadata block with nothing
content = content.replace(/export async function generateMetadata[\s\S]*?\}\s*export default async function/m, "export default async function");

fs.writeFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', content, 'utf8');
