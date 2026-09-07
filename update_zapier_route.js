const fs = require('fs');

let content = fs.readFileSync('src/app/api/webhooks/zapier/route.ts', 'utf8');

// When new lead is created
content = content.replace(
    /const newLead = await prisma\.lead\.create\({([\s\S]*?)}\);/,
    `const newLead = await prisma.lead.create({$1});

        if (assignedUserId) {
            await prisma.notification.create({
                data: {
                    userId: assignedUserId,
                    title: 'New Lead Assigned ??',
                    message: \`\${name} (\${cleanedPhone}) from \${source} has been assigned to you.\`,
                    type: 'LEAD_ASSIGNED',
                    link: \`/en/dashboard/leads\`
                }
            });
        }`
);

fs.writeFileSync('src/app/api/webhooks/zapier/route.ts', content);
