const fs = require('fs');
let importApi = fs.readFileSync('src/app/api/admin/leads/import/route.ts', 'utf8');

const importApiCheck = `
            // Check for duplicate
            const existingLead = await prisma.lead.findFirst({
                where: { phone: cleanPhone }
            });
            if (existingLead) {
                skippedCount++;
                continue;
            }

            await prisma.lead.create({
`;
importApi = importApi.replace("await prisma.lead.create({", importApiCheck);
fs.writeFileSync('src/app/api/admin/leads/import/route.ts', importApi);
