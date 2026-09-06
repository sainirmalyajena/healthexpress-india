import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'opd_data.csv');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').slice(1);
    let updated = 0;
    let created = 0;

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
          opdDate = new Date(`${year}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}T10:00:00Z`);
        }
      }
      
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
            city: 'Unknown',
            description: 'OPD Data CSV Import'
          }
        });
        created++;
      }
    }

    return NextResponse.json({ success: true, updated, created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
