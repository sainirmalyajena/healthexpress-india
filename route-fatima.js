const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', 'api', 'webhooks', 'meta-leads', 'route.ts');
let content = fs.readFileSync(file, 'utf8');

// The original query block
const oldLogic = `const counselor = await prisma.user.findFirst({
            where: { role: 'team' },
            orderBy: { assignedLeads: { _count: 'asc' } },
            select: { id: true, name: true, email: true }
        });`;

// New logic specifically targeting Fatima
const newLogic = `const counselor = await prisma.user.findFirst({
            where: { name: { contains: 'Fatima', mode: 'insensitive' } },
            select: { id: true, name: true, email: true }
        });`;

if (content.includes(oldLogic)) {
    content = content.replace(oldLogic, newLogic);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Successfully updated webhook assignment logic to Fatima.");
} else {
    console.log("Could not find the old logic block in the file.");
}
