require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function addUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'anshita@healthexpressindia.com' },
      update: {},
      create: {
        name: 'Anshita Raj',
        email: 'anshita@healthexpressindia.com',
        passwordHash: hashedPassword,
        role: 'team'
      }
    });
    console.log('Successfully added user:', user.name);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}
addUser();
