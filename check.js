require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkLeads() {
  const phones = ["9022877826", "8369499397", "9702221514"];
  for (const phone of phones) {
    const leads = await prisma.lead.findMany({
      where: { phone: { contains: phone } }
    });
    console.log("Phone", phone, "found:", leads.length);
    leads.forEach(l => console.log("   - ID:", l.id, "Ref:", l.referenceId, "Assigned:", l.assignedUserId, "Source:", l.sourcePage));
  }
}
checkLeads();
