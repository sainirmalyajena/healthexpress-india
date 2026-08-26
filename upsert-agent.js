const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const hash = await bcrypt.hash('team123', 10);
    await prisma.user.upsert({
        where: { email: 'agent1@healthexpress.in' },
        update: { passwordHash: hash, role: 'TEAM_MEMBER', name: 'Agent Rahul' },
        create: { email: 'agent1@healthexpress.in', passwordHash: hash, role: 'TEAM_MEMBER', name: 'Agent Rahul' }
    });
    console.log('upserted team member');
    const adminHash = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@healthexpress.in' },
        update: { passwordHash: adminHash, role: 'admin' },
        create: { email: 'admin@healthexpress.in', passwordHash: adminHash, role: 'admin', name: 'Admin User' }
    });
    console.log('upserted admin member');
}
main().finally(() => prisma.$disconnect());
