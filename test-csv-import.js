const Papa = require('papaparse');
const fs = require('fs');
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const text = fs.readFileSync('C:/Users/nirma/.gemini/antigravity/brain/f67091a1-43c2-4a93-92f8-466674b73fe7/.user_uploaded/media_1788178840734.csv', 'utf-8');

// Parse like CSVUploader does
const results = Papa.parse(text, { header: false, skipEmptyLines: true });
const rows = results.data;
const leads = [];

for (const row of rows) {
    if (row.length < 17) continue;
    const firstCell = (row[0] || '').trim();
    if (['platform', 'ad_id', 'full_name', 'id'].includes(firstCell.toLowerCase())) continue;
    
    const fullName = (row[14] || '').trim();
    const phone = (row[15] || '').trim();
    const city = (row[16] || '').trim();
    if (!fullName || !phone) continue;
    
    leads.push({
        full_name: fullName,
        phone: phone,
        city: city,
        created_time: (row[1] || '').trim(),
        platform: (row[11] || '').trim(),
        'which_centre_would_you_prefer?': (row[12] || '').trim(),
        'do_you_have_health_insurance?': (row[13] || '').trim(),
        lead_status: (row[17] || '').trim(),
        'Follow ups': (row[18] || '').trim(),
        'Notes ': (row[19] || '').trim(),
    });
}

console.log('Parsed leads:', leads.length);

// Now simulate exactly what the import API does
async function importLeads() {
    let importedCount = 0;
    let errorCount = 0;
    
    for (const row of leads.slice(0, 3)) { // Test with first 3 only
        const rawFullName = row.full_name || row.fullName || row['Full Name'] || row.Name;
        const rawPhone = row.phone || row.Phone || row['Phone Number'];
        
        if (!rawFullName || !rawPhone) {
            console.log('SKIP - no name/phone:', row);
            continue;
        }

        const cleanPhone = String(rawPhone).replace(/^p:/i, '').trim();
        const rawCity = row.city || row.City || 'Unknown';
        const notesField = row['Notes '] || row.Notes || row.notes || '';
        const followUpsField = row['Follow ups'] || row['Follow up'] || '';
        const centrePref = row['which_centre_would_you_prefer?'] || '';
        const healthIns = row['do_you_have_health_insurance?'] || '';
        const platform = row.platform || '';
        
        let combinedDescription = 'Imported from CSV';
        if (notesField || followUpsField || centrePref || healthIns) {
            combinedDescription = `Imported from CSV.\n`;
            if (centrePref) combinedDescription += `Centre Preference: ${centrePref}\n`;
            if (healthIns) combinedDescription += `Health Insurance: ${healthIns}\n`;
            if (platform) combinedDescription += `Platform: ${platform}\n`;
            if (followUpsField) combinedDescription += `Follow ups: ${followUpsField}\n`;
            if (notesField) combinedDescription += `Notes: ${notesField}`;
        }

        let createdAtDate = undefined;
        if (row.created_time || row.Date) {
            const parsedDate = new Date(row.created_time || row.Date);
            if (!isNaN(parsedDate.getTime())) {
                createdAtDate = parsedDate;
            }
        }

        try {
            const created = await prisma.lead.create({
                data: {
                    fullName: rawFullName,
                    phone: cleanPhone,
                    email: row.email || null,
                    city: rawCity,
                    description: combinedDescription.trim(),
                    status: 'NEW',
                    sourcePage: 'CSV Import',
                    utmSource: platform || 'csv_upload',
                    utmCampaign: row.campaign_name || null,
                    referenceId: 'CSV-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
                    assignedUserId: null,
                    ...(createdAtDate && { createdAt: createdAtDate })
                }
            });
            console.log('SUCCESS:', created.fullName, created.phone, created.referenceId);
            importedCount++;
        } catch (err) {
            console.error('ERROR creating lead:', rawFullName, err.message);
            errorCount++;
        }
    }

    console.log('\n=== IMPORT RESULT ===');
    console.log('Imported:', importedCount);
    console.log('Errors:', errorCount);
}

importLeads().catch(console.error).finally(() => prisma.$disconnect());
