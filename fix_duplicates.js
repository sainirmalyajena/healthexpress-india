const fs = require('fs');

// 1. Fix src/app/api/leads/route.ts
let leadsApi = fs.readFileSync('src/app/api/leads/route.ts', 'utf8');

const leadsApiCheck = `
        // Check for duplicate by phone
        const existingLead = await prisma.lead.findFirst({
            where: { phone: data.phone }
        });
        
        if (existingLead) {
            // Update existing lead instead of creating duplicate
            await prisma.lead.update({
                where: { id: existingLead.id },
                data: {
                    notes: (existingLead.notes ? existingLead.notes + '\n\n' : '') + '[Duplicate Submission] ' + notesContent
                }
            });
            return NextResponse.json({ success: true, referenceId: existingLead.referenceId });
        }

        // Save to DB
`;
leadsApi = leadsApi.replace("// Save to DB", leadsApiCheck);
fs.writeFileSync('src/app/api/leads/route.ts', leadsApi);

// 2. Fix src/app/api/webhooks/google-sheets/route.ts
let webhookApi = fs.readFileSync('src/app/api/webhooks/google-sheets/route.ts', 'utf8');

const webhookApiCheck = `
        // Check for duplicate by phone
        const existingLead = await prisma.lead.findFirst({
            where: { phone }
        });

        if (existingLead) {
            // Update existing lead instead of creating duplicate
            await prisma.lead.update({
                where: { id: existingLead.id },
                data: {
                    description: (existingLead.description ? existingLead.description + '\n\n' : '') + '[Duplicate Google Sheets Import]'
                }
            });
            return NextResponse.json({ success: true, message: 'Duplicate lead updated', referenceId: existingLead.referenceId });
        }

        const newLead = await prisma.lead.create({
`;
webhookApi = webhookApi.replace("const newLead = await prisma.lead.create({", webhookApiCheck);
fs.writeFileSync('src/app/api/webhooks/google-sheets/route.ts', webhookApi);
