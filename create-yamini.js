const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = "yamini@healthexpressindia.com";
    const password = "Yamini@123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            name: "Yamini",
            email: email,
            passwordHash: hashedPassword,
            role: "team"
        }
    });

    console.log(`Created user: ${user.name} with email ${user.email}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
