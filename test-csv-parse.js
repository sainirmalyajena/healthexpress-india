const Papa = require('papaparse');
const fs = require('fs');

const text = fs.readFileSync('C:/Users/nirma/.gemini/antigravity/brain/f67091a1-43c2-4a93-92f8-466674b73fe7/.user_uploaded/media_1788178840734.csv', 'utf-8');

console.log('=== FILE INFO ===');
console.log('Total chars:', text.length);
console.log('First 50 chars:', JSON.stringify(text.substring(0, 50)));
console.log('Starts with l:', text.trimStart().startsWith('l:'));

// Replicate the exact parseMetaAdsCsv logic from CSVUploader
const results = Papa.parse(text, {
    header: false,
    skipEmptyLines: true,
});

const rows = results.data;
console.log('\n=== PAPAPARSE RESULTS ===');
console.log('Total rows parsed:', rows.length);
console.log('Row 0 length:', rows[0]?.length);
console.log('Row 1 length:', rows[1]?.length);
console.log('Row 2 length:', rows[2]?.length);

// Show what's at the key positions for the first few data rows
for (let i = 0; i < Math.min(5, rows.length); i++) {
    const row = rows[i];
    const firstCell = (row[0] || '').trim();
    console.log(`\n--- Row ${i} ---`);
    console.log('  [0] firstCell:', JSON.stringify(firstCell));
    console.log('  [14] full_name:', JSON.stringify(row[14]));
    console.log('  [15] phone:', JSON.stringify(row[15]));
    console.log('  [16] city:', JSON.stringify(row[16]));
    console.log('  [17] status:', JSON.stringify(row[17]));
    console.log('  [18] follow_ups:', JSON.stringify(row[18]));
    console.log('  [19] notes:', JSON.stringify(row[19]));
    
    // Check skip conditions
    const skip_short = row.length < 17;
    const skip_header = ['platform', 'ad_id', 'full_name', 'id'].includes(firstCell.toLowerCase());
    const name = (row[14] || '').trim();
    const phone = (row[15] || '').trim();
    const skip_empty = !name || !phone;
    console.log('  SKIP? short:', skip_short, 'header:', skip_header, 'empty_name_phone:', skip_empty);
}

// Now run the full extraction
const leads = [];
for (const row of rows) {
    if (row.length < 17) continue;
    const firstCell = (row[0] || '').trim();
    if (['platform', 'ad_id', 'full_name', 'id'].includes(firstCell.toLowerCase())) continue;
    
    const fullName = (row[14] || '').trim();
    const phone = (row[15] || '').trim();
    const city = (row[16] || '').trim();
    if (!fullName || !phone) continue;
    
    leads.push({ fullName, phone, city });
}

console.log('\n=== FINAL RESULT ===');
console.log('Total leads extracted:', leads.length);
if (leads.length > 0) {
    console.log('First 5 leads:');
    leads.slice(0, 5).forEach((l, i) => console.log(`  ${i}: ${l.fullName} | ${l.phone} | ${l.city}`));
}
if (leads.length === 0) {
    console.log('NO LEADS EXTRACTED! Something is wrong with positional mapping.');
}
