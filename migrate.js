const { PrismaClient } = require('./src/generated/prisma/index.js');
const prisma = new PrismaClient();
async function run() {
  const toRemove = ['QUALIFIED', 'ASSIGNED', 'SCHEDULED', 'COMPLETED'];
  await prisma.lead.updateMany({
    where: { status: { in: toRemove } },
    data: { status: 'NEW' }
  });
  console.log('Migrated old statuses to NEW');
}
run().catch(console.error).finally(() => prisma.$disconnect());
