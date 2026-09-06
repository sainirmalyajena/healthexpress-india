const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    where: { OR: [{ name: { contains: 'shiva', mode: 'insensitive' } }, { email: { contains: 'shiva', mode: 'insensitive' } }] }
  });
  console.log("Users:", users);
}
main();
