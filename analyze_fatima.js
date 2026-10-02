require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function analyzePerformance() {
  const fatima = await prisma.user.findFirst({
    where: { name: { contains: 'Fatima', mode: 'insensitive' } }
  });

  if (!fatima) {
    console.log('Fatima not found in database.');
    return;
  }

  const leads = await prisma.lead.findMany({
    where: { assignedUserId: fatima.id },
    select: { status: true }
  });

  const total = leads.length;
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const activities = await prisma.activityLog.count({
    where: { userId: fatima.id }
  });

  console.log('--- Fatima Performance ---');
  console.log('Last Active:', fatima.lastActiveAt);
  console.log('Total Leads Assigned:', total);
  console.log('Status Breakdown:', statusCounts);
  console.log('Total Actions Logged (Calls/Notes/Status Changes):', activities);
}
analyzePerformance();
