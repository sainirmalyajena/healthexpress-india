import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();
async function fix() {
    await prisma.user.updateMany({
        where: { role: 'team' },
        data: { passwordHash: '$2b$10$TVYFd60JWXdrr2CVdV4j.urGEK9pCrUPAhRzB9cHbvWXVgd04j4xC' }
    });
    console.log('Really fixed passwords!');
}
fix();
