require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function checkTypes() {
  const types = await prisma.activityLog.groupBy({
    by: ['actionType'],
    _count: { id: true }
  });
  console.log(types);
}
checkTypes();
