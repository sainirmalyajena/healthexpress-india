import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing database connection...');
    const userCount = await prisma.user.count();
    console.log(`Connection successful! Total users: ${userCount}`);
    
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@healthexpress.in' }
    });
    
    if (admin) {
      console.log('Admin user found.');
    } else {
      console.log('Admin user NOT found.');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
