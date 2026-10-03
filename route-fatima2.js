const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', 'api', 'webhooks', 'meta-leads', 'route.ts');
let content = fs.readFileSync(file, 'utf8');

const regex = /const counselor = await prisma\.user\.findFirst\(\{\s*where: \{ role: 'team' \},\s*orderBy: \{ assignedLeads: \{ _count: 'asc' \} \},\s*select: \{ id: true, name: true, email: true \}\s*\}\);/;

const newLogic = `const counselor = await prisma.user.findFirst({
            where: { name: { contains: 'Fatima', mode: 'insensitive' } },
            select: { id: true, name: true, email: true }
        });`;

content = content.replace(regex, newLogic);
fs.writeFileSync(file, content, 'utf8');
console.log("Replaced using regex");
