const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: 'swati', mode: 'insensitive' } },
        { name: { contains: 'shwati', mode: 'insensitive' } },
        { email: { contains: 'swati', mode: 'insensitive' } },
        { email: { contains: 'shwati', mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true
    }
  });
  console.log(JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
