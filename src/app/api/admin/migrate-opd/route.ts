import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const content = \
Name , OPD Date ,Hospital ,MOB,OPD BOOKED BY,Attended  ,Insurance ,Remarks 
Dear Poonam Chorge ,25/8/2026, ASG Eye Hospital - Kalyan.,918655212514,Sai,No,Yes,Patient father is having cadia attack so will consult after few days  
Ashraf Akbar Shaikh,29/08/2026, ASG Eye Hospital - Kalyan.,917276467672,Sai,,,
Ronak Dinesh  Somani,19/08/2026, ASG Eye Hospital - Kalyan.,,Sai,Yes ,Yes,OPD  done insurace details shared waiting for approval 29th surgery/ Surgery postporned due to dengue  will plan on 12 
Sanjiv Tadavi,19/08/2026, ASG Eye Hospital - Kalyan.,7499929935,Sai,No,No,did not visit because of busy shedule  
Shubham ,19/08/2026, ASG Eye Hospital - Kalyan.,8591387856,Swati ,No,,rnr 
JYOTI PAWLE,17/08/2026, ASG Eye Hospital - Kalyan.,,Swati ,,,
Prasad ,17/08/2026, ASG Eye Hospital - Kalyan.,,Swati ,,,
Mohd RAFIQ,03/08/2026, ASG Eye Hospital - Kalyan.,,Swati ,No,,
Sachin Jadhav,24/08/2026, ASG Eye Hospital - Kalyan.,917798194252,Sai,,,rnr /26
Anita,23/08/2026, ASG Eye Hospital - Kalyan.,917304696080,Siva,No,,Insurance patient but have not shared the insurance  Invalid pattient pateint angry 
Srinivas,22/08/2026,Envision eye hospital ,919820896505,Siva,No,No,will update the date of opd
Darshan Vartak,29/08/2026,Envision eye hospital ,918010786974,Swati ,Yes ,,29/8 nr/pt will go for opd  /dropped wa 
Ahir Ashwin,24/08/2026,Envision eye hospital ,918104689917,Sai ,,,patient is his bother said will talk and update if attended the opd or not  no update29th 
Dinesh Prajapat,26/08/2026,Envision eye hospital ,916375354657,Sai,No,No,Patient have not visited  and he want it cheep of cost eye power 7 and budget 30k
Laique Farooque,04/09/2026,Envision eye hospital ,917972292634,Sai ,Yes ,,medical management  
Kavita Poojari,29/08/2026,Envision eye hospital ,919967059858,Swati ,,,29/8call done pt will come by 5 pm  Resheduled for 29th 
Pranita Sharke,24/08/2026,Envision eye hospital ,918652034485,Swati ,,,rnr 
Indrajit Roy,06/08/2026, ASG Eye Hospital - Kalyan.,8617892604,Swati ,Yes ,,29/8 nr Patient and his friend want the surgery pune asg consultation done pitched for  kalyan because they have waiting period  
mohd farooqk ,,,9648339871,,Yes ,,
pratik botre ,,,,,Yes ,,
Mahamod kasar,06/08/2026,MEC,9594669013,Sai,Yes ,,
Ansh Chokhrat,18/08/2026, ASG Eye Hospital - Noida.,919555966688,Swati ,Yes ,Yes,Surgery planned for 6th of november  
Aditya Pratap Singh ,01/08/2026, ASG Eye Hospital - Noida.,,,,,
Hussain ,19/08/2026,Envision eye hospital ,,Siva,,,No update 
Ashton,19/08/2026,Envision eye hospital ,,Swati ,No,,rnr 
Taslim Javed Ansari,17/08/2026,Envision eye hospital ,,Swati ,,,No update 
Salim ,18/08/2026,,,,,,
Ajay Kumar,26/08/2026,Envision eye hospital ,919211681210,Sai,Yes ,No,OPD done no surgery required medical managment  
Dhiraj Kumar ,21/08/2026,Eye Veda Prime,918527372764,Swati ,Yes ,Yes,Surgery is planned for 29th  Surgery done both eye 
Rakesh ,22/08/2026,MEC,,Swati ,,Yes,RNR Patient might have done from compitators  
Akanksha Gupta ,19/08/2026,MEC,9004629317,Sai,Yes ,Yes,Patient will discuss with his family and confirm the iIPD date / She is having some health issue will update the date 
Renuka Motaria,05/09/2026,Sharp Sight Delhi,8897240168,,,Yes,Patient will book the opd waiting for  her wife e card  Resheduled will update the date 
Arif,31/08/2026, ASG Eye Hospital - Kalyan.,918446235288,Swati ,,,31/8 confirmation call done /nr /dropped wa 28/8 OPD on 31./8 he will confirm by today evening 
Prashant...,05/09/2026,ASG Noida  ,p:+917983637222,Swati ,,,
Kaif,31/08/2026,MEC,9372599963,Sai,,No,31/8 confirmation call done /nr /dropped wa 
Vikas Kamble,03/09/2026, ASG Eye Hospital - Kalyan.,919049237340,Sai,,No,cataract surgey done in the pass as well but again same problem consulted multiple dr as well but not getting resolution 
Pratik Kshetre,31/08/2026,MEC,918828661981,Swati ,,,OPD booked for 31st 
Vivek Agarwal ,29/08/2026,Prime Eye veda ,,Swati ,,,
Ram milan ,29/08/2026,Prime Eye veda ,,Swati ,,,
Pratik singh roy  ,29/08/2026,,,,,,
Om Maraiya Arjun Maraiya,07/09/2026,ENVISION ,p:+919324150198,Swati ,,,OPD 7/9 by 1 pm at envision 
Rupesh Kashivale,01/09/2026,ASG kalyan ,8600799489,Swati ,,,1/9 confirmation call done nr /dropped wa OPD ON 1/9 AT KALYAN ASG  5 PM
Kavita poojari ,29/08/2026,ENVISION ,,,,,
Priyatham Yalla,05/09/2026,,,,,,
Santosh Shinde,29/08/2026,,,,,,
Sanjay Dangar,25/08/2026,ASG vashi,,,,,
Laique farooque ,04/09/2026,ASG kalyan ,917972292634,,,,
Shreedhan Shinde,2/9/2026,ASG kalyan ,919833670515,,,,
Vajiu Anna,29/08/2026,ASG Pune ,9637598079,,,,
Vikas Singh,11/08/2026,ASG Pune ,,,,,
Mohsin Tamboli,10/09/2026,ENVISION ,917378385529,Amir ,,,
Renuka Motaria,05/09/26,Sharp sight eye hospital ,8897240168,,,,
Khan Irshad,08/09/2026,MEC,919328576219,,,,
\`;
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

