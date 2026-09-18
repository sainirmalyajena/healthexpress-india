require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function checkSpecificLead() {
    try {
        const lead = await prisma.lead.findFirst({
            where: { fullName: 'Emmanuel Masapogu' },
            select: { fullName: true, createdAt: true, status: true }
        });
        console.log(lead);
        
        const priyatham = await prisma.lead.findFirst({
            where: { fullName: 'Priyatham Yalla' },
            select: { fullName: true, createdAt: true, status: true }
        });
        console.log(priyatham);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkSpecificLead();
