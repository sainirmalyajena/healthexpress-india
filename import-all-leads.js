const Papa = require('papaparse');
const fs = require('fs');
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const text = fs.readFileSync('C:/Users/nirma/.gemini/antigravity/brain/f67091a1-43c2-4a93-92f8-466674b73fe7/.user_uploaded/media_1788178840734.csv', 'utf-8');

const results = Papa.parse(text, { header: false, skipEmptyLines: true });
const rows = results.data;

async function importAll() {
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const row of rows) {
        if (row.length < 17) continue;
        const firstCell = (row[0] || '').trim();
        if (['platform', 'ad_id', 'full_name', 'id'].includes(firstCell.toLowerCase())) continue;

        const fullName = (row[14] || '').trim();
        const rawPhone = (row[15] || '').trim();
        const city = (row[16] || '').trim();
        if (!fullName || !rawPhone) { skippedCount++; continue; }

        const cleanPhone = rawPhone.replace(/^p:/i, '').trim();
        const centrePref = (row[12] || '').trim();
        const healthIns = (row[13] || '').trim();
        const platform = (row[11] || '').trim();
        const followUps = (row[18] || '').trim();
        const notes = (row[19] || '').trim();

        let description = 'Imported from CSV.';
        if (centrePref) description += `\nCentre Preference: ${centrePref}`;
        if (healthIns) description += `\nHealth Insurance: ${healthIns}`;
        if (platform) description += `\nPlatform: ${platform}`;
        if (followUps) description += `\nFollow ups: ${followUps}`;
        if (notes) description += `\nNotes: ${notes}`;

        let createdAtDate = undefined;
        const rawDate = (row[1] || '').trim();
        if (rawDate) {
            const parsed = new Date(rawDate);
            if (!isNaN(parsed.getTime())) createdAtDate = parsed;
        }

        try {
            await prisma.lead.create({
                data: {
                    fullName,
                    phone: cleanPhone,
                    email: null,
                    city: city || 'Unknown',
                    description: description.trim(),
                    status: 'NEW',
                    sourcePage: 'CSV Import',
                    utmSource: platform || 'csv_upload',
                    referenceId: 'CSV-' + Date.now() + '-' + Math.floor(Math.random() * 100000),
                    assignedUserId: null,
                    ...(createdAtDate && { createdAt: createdAtDate })
                }
            });
            importedCount++;
        } catch (err) {
            console.error('ERROR:', fullName, err.message);
            errorCount++;
        }
    }

    console.log('=== IMPORT COMPLETE ===');
    console.log('Imported:', importedCount);
    console.log('Skipped:', skippedCount);
    console.log('Errors:', errorCount);
}

importAll().catch(console.error).finally(() => prisma.$disconnect());
