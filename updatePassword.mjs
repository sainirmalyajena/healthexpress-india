import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('HealthExpress@2026', 10);
    await prisma.user.update({
        where: { email: 'admin@healthexpress.in' },
        data: { passwordHash }
    });
    console.log("Password updated successfully!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
