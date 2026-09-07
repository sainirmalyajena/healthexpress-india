const fs = require('fs');
const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

async function processData() {
  const content = fs.readFileSync('opd_data.csv', 'utf8');
  const lines = content.split('\n').slice(1);
  let updated = 0;
  let created = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(',');
    if (parts.length < 8) continue;
    
    let [name, opdDateStr, hospitalName, mob, bookedBy, attended, insuranceStr, remarks] = parts.map(p => p.trim());
    
    if (!name) continue;
    
    // clean phone
    let phone = mob.replace(/[^0-9]/g, '');
    if (phone.startsWith('91') && phone.length > 10) {
       phone = phone.substring(2);
    }
    
    if (!phone || phone.length < 10) continue; // skip invalid or empty numbers

    // Parse date if possible
    let opdDate = null;
    if (opdDateStr) {
      const parts = opdDateStr.split('/');
      if (parts.length === 3) {
        let year = parseInt(parts[2]);
        if (year < 2000) year += 2000;
        opdDate = new Date(`${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T10:00:00Z`);
      }
    }
    
    // Notes
    let notes = `[OPD Data Import]\n`;
    if (hospitalName) notes += `Hospital: ${hospitalName}\n`;
    if (opdDateStr) notes += `OPD Date: ${opdDateStr}\n`;
    if (bookedBy) notes += `Booked By: ${bookedBy}\n`;
    if (attended) notes += `Attended: ${attended}\n`;
    if (insuranceStr) notes += `Insurance: ${insuranceStr}\n`;
    if (remarks) notes += `Remarks: ${remarks}\n`;

    const existingLead = await prisma.lead.findFirst({
      where: { phone: { contains: phone } }
    });

    if (existingLead) {
      if (existingLead.status === 'NEW') {
        await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            status: 'OPD_SCHEDULED',
            notes: (existingLead.notes ? existingLead.notes + '\n\n' : '') + notes,
            opdDate: opdDate || existingLead.opdDate,
          }
        });
        updated++;
      } else {
        // Just append notes if not in NEW, or we could skip. Let's just append notes.
        await prisma.lead.update({
          where: { id: existingLead.id },
          data: {
            notes: (existingLead.notes ? existingLead.notes + '\n\n' : '') + notes,
          }
        });
      }
    } else {
      await prisma.lead.create({
        data: {
          fullName: name,
          phone: phone,
          status: 'OPD_SCHEDULED',
          notes: notes,
          opdDate: opdDate,
          sourcePage: 'OPD Data CSV Import',
          city: 'Unknown', description: 'OPD Data CSV Import'
        }
      });
      created++;
    }
  }

  console.log(`Processed! Updated: ${updated}, Created: ${created}`);
}

processData().catch(console.error).finally(() => prisma.$disconnect());

