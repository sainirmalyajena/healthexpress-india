const fs = require('fs');
const Papa = require('papaparse');
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function run() {
    const text = fs.readFileSync('import_latest.csv', 'utf8');
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    const adminId = 'cmt1dfhbz0000wgnskg4mru6x';

    let count = 0;
    for (const row of parsed.data) {
        const rawPhone = row['Phone Number'];
        if (!rawPhone || !row['Patient Name']) continue;
        
        const cleanPhone = rawPhone.replace(/^p:/i, '').trim();
        const description = [
            'Imported from CSV (Manual Upload)',
            'Centre Preference: ' + (row['Preferred Centre'] || ''),
            'Health Insurance: ' + (row['Health Insurance'] || ''),
            'LASIK Interest: ' + (row['Looking for LASIK'] || ''),
            'Platform: ' + (row['Platform'] || ''),
            'Campaign: ' + (row['Campaign'] || ''),
        ].join('\n');

        // Check if exists
        const exists = await prisma.lead.findFirst({ where: { phone: cleanPhone } });
        if (exists) {
            console.log('Skipping existing lead:', cleanPhone);
            continue;
        }

        let createdDate = new Date();
        if (row['Lead Date']) {
            // "19-09-2026 12:39 AM"
            const parts = row['Lead Date'].split(/[\s-:]/);
            // parts: 19, 09, 2026, 12, 39, AM
            if (parts.length >= 5) {
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                const year = parseInt(parts[2], 10);
                let hour = parseInt(parts[3], 10);
                const min = parseInt(parts[4], 10);
                const ampm = parts[5];
                if (ampm && ampm.toUpperCase() === 'PM' && hour < 12) hour += 12;
                if (ampm && ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
                createdDate = new Date(year, month, day, hour, min, 0);
            }
        }

        await prisma.lead.create({
            data: {
                fullName: row['Patient Name'],
                phone: cleanPhone,
                city: row['City'] || '',
                description,
                status: 'NEW',
                sourcePage: 'CSV Import',
                utmSource: row['Platform'] || 'facebook_ads',
                utmCampaign: row['Campaign'] || null,
                referenceId: row['Lead ID'] || 'CSV-' + Date.now() + Math.floor(Math.random()*1000),
                assignedUserId: adminId,
                createdAt: createdDate
            }
        });
        count++;
    }
    console.log('Inserted', count, 'leads.');
}
run();
