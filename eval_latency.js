require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function measureParallel() {
    const start = Date.now();
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const whereClause = {};

    const results = await Promise.all([
        prisma.lead.findMany({ where: {}, take: 20 }),
        prisma.lead.count({ where: {} }),
        prisma.surgery.findMany({ select: { id: true, name: true } }),
        prisma.hospital.findMany({ select: { id: true, name: true, discountPercent: true } }),
        prisma.lead.findMany({ select: { city: true }, distinct: ['city'], where: { city: { not: '' } } }),
        prisma.user.findMany({ select: { id: true, name: true, email: true } }),
        prisma.surgery.findMany({ select: { id: true, name: true } }),
        prisma.lead.count({ where: { status: 'NEW' } }),
        prisma.lead.count({ where: { status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] }, followUpDate: { lt: now } } }),
        prisma.lead.count({ where: { status: { notIn: ['CLOSED', 'LOST'] }, followUpDate: { gte: startOfToday, lte: endOfToday } } }),
        prisma.lead.count({ where: { opdDate: { gte: startOfToday, lte: endOfToday } } })
    ]);
    
    console.log(`Parallel time: ${Date.now() - start} ms`);
}

async function measureSequential() {
    const start = Date.now();
    
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    await prisma.lead.findMany({ where: {}, take: 20 });
    await prisma.lead.count({ where: {} });
    await prisma.surgery.findMany({ select: { id: true, name: true } });
    await prisma.hospital.findMany({ select: { id: true, name: true, discountPercent: true } });
    await prisma.lead.findMany({ select: { city: true }, distinct: ['city'], where: { city: { not: '' } } });
    await prisma.user.findMany({ select: { id: true, name: true, email: true } });
    await prisma.surgery.findMany({ select: { id: true, name: true } });
    await prisma.lead.count({ where: { status: 'NEW' } });
    await prisma.lead.count({ where: { status: { notIn: ['OPD_DONE', 'SURGERY_DONE', 'SURGERY_SCHEDULED', 'CLOSED', 'LOST'] }, followUpDate: { lt: now } } });
    await prisma.lead.count({ where: { status: { notIn: ['CLOSED', 'LOST'] }, followUpDate: { gte: startOfToday, lte: endOfToday } } });
    await prisma.lead.count({ where: { opdDate: { gte: startOfToday, lte: endOfToday } } });

    console.log(`Sequential time: ${Date.now() - start} ms`);
}

async function run() {
    console.log("Warming up DB pool...");
    await prisma.lead.count();
    
    console.log("\nTesting old sequential loading...");
    await measureSequential();
    
    console.log("\nTesting new parallel loading...");
    await measureParallel();
    
    await prisma.$disconnect();
}

run();
