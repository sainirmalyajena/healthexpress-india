
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const content = "﻿Name , OPD Date ,Hospital ,MOB,OPD BOOKED BY,Attended  ,Insurance ,Remarks \nDear Poonam Chorge ,25/8/2026, ASG Eye Hospital - Kalyan.,918655212514,Sai,No,Yes,Patient father is having cadia attack so will consult after few days  \nAshraf Akbar Shaikh,29/08/2026, ASG Eye Hospital - Kalyan.,917276467672,Sai,,,\nRonak Dinesh  Somani,19/08/2026, ASG Eye Hospital - Kalyan.,,Sai,Yes ,Yes,OPD  done insurace details shared waiting for approval 29th surgery/ Surgery postporned due to dengue  will plan on 12 \nSanjiv Tadavi,19/08/2026, ASG Eye Hospital - Kalyan.,7499929935,Sai,No,No,did not visit because of busy shedule  \nShubham ,19/08/2026, ASG Eye Hospital - Kalyan.,8591387856,Swati ,No,,rnr \nJYOTI PAWLE,17/08/2026, ASG Eye Hospital - Kalyan.,,Swati ,,,\nPrasad ,17/08/2026, ASG Eye Hospital - Kalyan.,,Swati ,,,\nMohd RAFIQ,03/08/2026, ASG Eye Hospital - Kalyan.,,Swati ,No,,\nSachin Jadhav,24/08/2026, ASG Eye Hospital - Kalyan.,917798194252,Sai,,,rnr /26\nAnita,23/08/2026, ASG Eye Hospital - Kalyan.,917304696080,Siva,No,,Insurance patient but have not shared the insurance  Invalid pattient pateint angry \nSrinivas,22/08/2026,Envision eye hospital ,919820896505,Siva,No,No,will update the date of opd\nDarshan Vartak,29/08/2026,Envision eye hospital ,918010786974,Swati ,Yes ,,29/8 nr/pt will go for opd  /dropped wa \nAhir Ashwin,24/08/2026,Envision eye hospital ,918104689917,Sai ,,,patient is his bother said will talk and update if attended the opd or not  no update29th \nDinesh Prajapat,26/08/2026,Envision eye hospital ,916375354657,Sai,No,No,Patient have not visited  and he want it cheep of cost eye power 7 and budget 30k\nLaique Farooque,04/09/2026,Envision eye hospital ,917972292634,Sai ,Yes ,,medical management  \nKavita Poojari,29/08/2026,Envision eye hospital ,919967059858,Swati ,,,29/8call done pt will come by 5 pm  Resheduled for 29th \nPranita Sharke,24/08/2026,Envision eye hospital ,918652034485,Swati ,,,rnr \nIndrajit Roy,06/08/2026, ASG Eye Hospital - Kalyan.,8617892604,Swati ,Yes ,,29/8 nr Patient and his friend want the surgery pune asg consultation done pitched for  kalyan because they have waiting period  \nmohd farooqk ,,,9648339871,,Yes ,,\npratik botre ,,,,,Yes ,,\nMahamod kasar,06/08/2026,MEC,9594669013,Sai,Yes ,,\nAnsh Chokhrat,18/08/2026, ASG Eye Hospital - Noida.,919555966688,Swati ,Yes ,Yes,Surgery planned for 6th of november  \nAditya Pratap Singh ,01/08/2026, ASG Eye Hospital - Noida.,,,,,\nHussain ,19/08/2026,Envision eye hospital ,,Siva,,,No update \nAshton,19/08/2026,Envision eye hospital ,,Swati ,No,,rnr \nTaslim Javed Ansari,17/08/2026,Envision eye hospital ,,Swati ,,,No update \nSalim ,18/08/2026,,,,,,\nAjay Kumar,26/08/2026,Envision eye hospital ,919211681210,Sai,Yes ,No,OPD done no surgery required medical managment  \nDhiraj Kumar ,21/08/2026,Eye Veda Prime,918527372764,Swati ,Yes ,Yes,Surgery is planned for 29th  Surgery done both eye \nRakesh ,22/08/2026,MEC,,Swati ,,Yes,RNR Patient might have done from compitators  \nAkanksha Gupta ,19/08/2026,MEC,9004629317,Sai,Yes ,Yes,Patient will discuss with his family and confirm the iIPD date / She is having some health issue will update the date \nRenuka Motaria,05/09/2026,Sharp Sight Delhi,8897240168,,,Yes,Patient will book the opd waiting for  her wife e card  Resheduled will update the date \nArif,31/08/2026, ASG Eye Hospital - Kalyan.,918446235288,Swati ,,,31/8 confirmation call done /nr /dropped wa 28/8 OPD on 31./8 he will confirm by today evening \nPrashant...,05/09/2026,ASG Noida  ,p:+917983637222,Swati ,,,\nKaif,31/08/2026,MEC,9372599963,Sai,,No,31/8 confirmation call done /nr /dropped wa \nVikas Kamble,03/09/2026, ASG Eye Hospital - Kalyan.,919049237340,Sai,,No,cataract surgey done in the pass as well but again same problem consulted multiple dr as well but not getting resolution \nPratik Kshetre,31/08/2026,MEC,918828661981,Swati ,,,OPD booked for 31st \nVivek Agarwal ,29/08/2026,Prime Eye veda ,,Swati ,,,\nRam milan ,29/08/2026,Prime Eye veda ,,Swati ,,,\nPratik singh roy  ,29/08/2026,,,,,,\nOm Maraiya Arjun Maraiya,07/09/2026,ENVISION ,p:+919324150198,Swati ,,,OPD 7/9 by 1 pm at envision \nRupesh Kashivale,01/09/2026,ASG kalyan ,8600799489,Swati ,,,1/9 confirmation call done nr /dropped wa OPD ON 1/9 AT KALYAN ASG  5 PM\nKavita poojari ,29/08/2026,ENVISION ,,,,,\nPriyatham Yalla,05/09/2026,,,,,,\nSantosh Shinde,29/08/2026,,,,,,\nSanjay Dangar,25/08/2026,ASG vashi,,,,,\nLaique farooque ,04/09/2026,ASG kalyan ,917972292634,,,,\nShreedhan Shinde,2/9/2026,ASG kalyan ,919833670515,,,,\nVajiu Anna,29/08/2026,ASG Pune ,9637598079,,,,\nVikas Singh,11/08/2026,ASG Pune ,,,,,\nMohsin Tamboli,10/09/2026,ENVISION ,917378385529,Amir ,,,\nRenuka Motaria,05/09/26,Sharp sight eye hospital ,8897240168,,,,\nKhan Irshad,08/09/2026,MEC,919328576219,,,,\r\n";
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
        const referenceId = `HE-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        await prisma.lead.create({
          data: {
            referenceId,
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
