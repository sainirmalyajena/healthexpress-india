import { prisma } from './src/lib/prisma';
import * as bcrypt from 'bcryptjs';

async function main() {
    const passwordHash = await bcrypt.hash('HealthExpress@2026', 10);

    const shiva = await prisma.user.upsert({
        where: { email: 'shiva@healthexpressindia.com' },
        update: {},
        create: {
            email: 'shiva@healthexpressindia.com',
            name: 'Shiva',
            passwordHash,
            role: 'team',
        },
    });

    const shweta = await prisma.user.upsert({
        where: { email: 'shweta@healthexpressindia.com' },
        update: {},
        create: {
            email: 'shweta@healthexpressindia.com',
            name: 'Shweta',
            passwordHash,
            role: 'team',
        },
    });

    console.log('Created users:', shiva.email, shweta.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
