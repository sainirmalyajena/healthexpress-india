const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  const counts = await prisma.lead.groupBy({
    by: ['status'],
    _count: { status: true }
  });
  console.log(counts);
}
check().catch(console.error).finally(() => prisma.$disconnect());
