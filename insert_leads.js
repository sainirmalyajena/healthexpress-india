require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const leads = [
  {
    fullName: "saddam husain mohmmad Habib tagala",
    phone: "+919022877826",
    city: "bhiwandi",
    utmSource: "fb",
    sourcePage: "Meta Lead Ads",
    description: "Centre: kalyan, Insurance: no, Lasik: yes",
    assignedUserId: "cmumlkevp0000ifdkncjcbqhg",
    status: "NEW",
    referenceId: "l:1104709795248728"
  },
  {
    fullName: "ابوذر",
    phone: "+918369499397",
    city: "Mumbai",
    utmSource: "ig",
    sourcePage: "Meta Lead Ads",
    description: "Centre: jogeshwari, Insurance: no, Lasik: yes",
    assignedUserId: "cmumlkevp0000ifdkncjcbqhg",
    status: "NEW",
    referenceId: "l:1756076379703581"
  },
  {
    fullName: "Mohd Sakil",
    phone: "+919702221514",
    city: "Mumbai",
    utmSource: "fb",
    sourcePage: "Meta Lead Ads",
    description: "Centre: ghatkopar, Insurance: yes, Lasik: yes",
    assignedUserId: "cmumlkevp0000ifdkncjcbqhg",
    status: "NEW",
    referenceId: "l:1450019666971410"
  }
];

async function insertLeads() {
  for (const l of leads) {
    try {
        await prisma.lead.upsert({
            where: { referenceId: l.referenceId },
            update: { assignedUserId: l.assignedUserId },
            create: l
        });
        console.log("Inserted/Updated:", l.fullName);
    } catch(e) {
        console.log("Error with", l.fullName, e.message);
    }
  }
}
insertLeads();
