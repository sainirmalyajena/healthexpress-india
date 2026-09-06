const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const s = await prisma.surgery.findUnique({ where: { slug: 'cataract-surgery' } });
  if (s) {
    console.log("type of faqs:", typeof s.faqs);
    console.log("isArray?", Array.isArray(s.faqs));
  }
}
main();
