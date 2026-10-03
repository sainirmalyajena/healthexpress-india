const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function main() {
    const users = await prisma.user.findMany({
        where: { role: 'team' },
        include: { _count: { select: { assignedLeads: true } } }
    });
    console.log(JSON.stringify(users.map(u => ({name: u.name, leads: u._count.assignedLeads})), null, 2));
}
main();
