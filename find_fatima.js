require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function findFatima() {
  const users = await prisma.user.findMany({
    where: { name: { contains: 'Fatima', mode: 'insensitive' } }
  });
  console.log(users);
}
findFatima();
