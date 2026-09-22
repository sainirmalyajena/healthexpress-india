const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('HealthExpress123!', 10);
  await prisma.user.update({
    where: { email: 'shwati@healthexpressindia.com' },
    data: { passwordHash: hash }
  });
  console.log('Password reset successfully');
}

main().catch(console.error).finally(() => prisma.$disconnect());
