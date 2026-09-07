const fs = require('fs');

async function doImport() {
  const content = fs.readFileSync('opd_data.csv', 'utf8');
  const lines = content.split('\n').slice(1);
  let leads = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(',');
    if (parts.length < 8) continue;
    
    let [name, opdDateStr, hospitalName, mob, bookedBy, attended, insuranceStr, remarks] = parts.map(p => p.trim());
    if (!name) continue;
    
    let phone = mob.replace(/[^0-9]/g, '');
    if (phone.startsWith('91') && phone.length > 10) {
       phone = phone.substring(2);
    }
    if (!phone || phone.length < 10) continue;

    let opdDate = null;
    if (opdDateStr) {
      const dateParts = opdDateStr.split('/');
      if (dateParts.length === 3) {
        let year = parseInt(dateParts[2]);
        if (year < 2000) year += 2000;
        opdDate = new Date(`${year}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}T10:00:00Z`).toISOString();
      }
    }
    
    let notes = `[OPD Data Import]\n`;
    if (hospitalName) notes += `Hospital: ${hospitalName}\n`;
    if (opdDateStr) notes += `OPD Date: ${opdDateStr}\n`;
    if (bookedBy) notes += `Booked By: ${bookedBy}\n`;
    if (attended) notes += `Attended: ${attended}\n`;
    if (insuranceStr) notes += `Insurance: ${insuranceStr}\n`;
    if (remarks) notes += `Remarks: ${remarks}\n`;

    leads.push({
      fullName: name,
      phone: phone,
      city: 'Unknown',
      status: 'OPD_SCHEDULED',
      notes: notes,
      description: 'OPD Data CSV Import',
      opdDate: opdDate
    });
  }

  console.log(`Sending ${leads.length} leads...`);
  
  const response = await fetch('https://www.healthexpressindia.com/api/admin/leads/import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // The API endpoint requires auth. Let me check if there is an auth check.
      // Wait, `/api/admin/leads/import` checks session!
      // If it checks session, I can't hit it without cookies!
    },
    body: JSON.stringify({ leads })
  });

  console.log('Response:', response.status, await response.text());
}

doImport().catch(console.error);
