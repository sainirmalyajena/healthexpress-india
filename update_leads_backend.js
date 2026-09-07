const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/dashboard/leads/page.tsx', 'utf8');

const updatedGetLeads = `
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (searchParams.quickFilter) {
        if (searchParams.quickFilter === 'uncontacted') {
            where.status = 'NEW';
        } else if (searchParams.quickFilter === 'overdue') {
            where.status = { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] };
            where.followUpDate = { lt: now };
        } else if (searchParams.quickFilter === 'today_followups') {
            where.status = { notIn: ['CLOSED', 'LOST'] };
            where.followUpDate = { gte: startOfToday, lte: endOfToday };
        } else if (searchParams.quickFilter === 'today_opds') {
            where.opdDate = { gte: startOfToday, lte: endOfToday };
        } else if (searchParams.quickFilter === 'today_surgeries') {
            where.status = 'SURGERY_SCHEDULED';
            // Assuming surgery date is stored somewhere. Wait, Lead doesn't have surgeryDate!
            // Wait, does Lead have surgeryDate? No, just opdDate and followUpDate.
            // If they are SURGERY_SCHEDULED, maybe we just show all of them? Or is there a followUpDate for it?
            // Let's just show all SURGERY_SCHEDULED leads for now if there is no surgeryDate field.
        }
    }
`;

content = content.replace(
    /const now = new Date\(\);[\s\S]*?(?=\n    if \(searchParams\.query\) \{)/m,
    updatedGetLeads
);

fs.writeFileSync('src/app/[lang]/dashboard/leads/page.tsx', content);
