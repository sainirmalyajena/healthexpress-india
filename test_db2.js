const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const s = await prisma.surgery.findUnique({ where: { slug: 'cataract-surgery' } });
    console.log(s ? s.name : 'Not Found');
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
