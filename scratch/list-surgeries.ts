import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  try {
    const surgeries = await prisma.surgery.findMany({
      select: { id: true, name: true, category: true }
    });
    console.log('Surgeries:', JSON.stringify(surgeries, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
