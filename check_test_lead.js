require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkTestLead() {
  const recentLeads = await prisma.lead.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 15 * 60 * 1000)
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  console.log("Recent leads:");
  console.log(recentLeads);
}
checkTestLead();
