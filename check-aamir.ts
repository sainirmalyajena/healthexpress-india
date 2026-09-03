import { PrismaClient } from './src/generated/prisma/index.js';
const prisma = new PrismaClient();
async function check() {
    const user = await prisma.user.findFirst({ where: { email: 'aamir@healthexpressindia.com' } });
    console.log(user);
}
check();
