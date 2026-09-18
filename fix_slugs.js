const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function fixSlugs() {
  const surgeries = await prisma.surgery.findMany();
  console.log(`Found ${surgeries.length} surgeries.`);

  let count = 0;
  for (const s of surgeries) {
    if (!s.slug) {
      let baseSlug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      let uniqueSlug = baseSlug;
      
      // Ensure unique slug
      let suffix = 1;
      while (true) {
        const existing = await prisma.surgery.findFirst({ where: { slug: uniqueSlug } });
        if (!existing) break;
        uniqueSlug = `${baseSlug}-${suffix}`;
        suffix++;
      }

      await prisma.surgery.update({
        where: { id: s.id },
        data: { slug: uniqueSlug }
      });
      console.log(`Updated ${s.name} -> ${uniqueSlug}`);
      count++;
    }
  }
  console.log(`Fixed ${count} slugs.`);
}

fixSlugs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
