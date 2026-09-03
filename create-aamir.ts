import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();
async function createAamir() {
    await prisma.user.create({
        data: {
            email: 'aamir@healthexpressindia.com',
            name: 'Aamir Sohail',
            role: 'team',
            passwordHash: '/ditu/Fwy/tMMEt5QCvhMgRWEkNAFK0dIzE6'
        }
    });
    console.log('Successfully created Aamir');
}
createAamir();
