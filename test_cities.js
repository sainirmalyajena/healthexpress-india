const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const s = await prisma.surgery.findUnique({ where: { slug: 'cataract-surgery' } });
  if (s) {
    console.log("availableCities:", s.availableCities);
  }
}
main();
