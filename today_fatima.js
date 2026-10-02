require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function todayStats() {
  const fatima = await prisma.user.findFirst({
    where: { name: { contains: 'Fatima', mode: 'insensitive' } }
  });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const activitiesToday = await prisma.activityLog.count({
    where: { 
      userId: fatima.id,
      createdAt: { gte: startOfDay }
    }
  });

  console.log('Actions Today:', activitiesToday);
}
todayStats();
