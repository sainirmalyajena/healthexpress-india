const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const patients = [
    { name: "Santaram Ramchandra Deval", opd: "15/07/2026", ipd: "06/08/2026", hospital: "ASG Kalyan", payment: "Insurance", amount: 45889, phone: "9967105465" },
    { name: "Raghunath Reddy", opd: "04/08/2026", ipd: "04/08/2026", hospital: "envision", payment: "Insurance", amount: 90000, phone: "8976700640" },
    { name: "Ruksar Salman Shaikh", opd: "18/08/2026", ipd: "19/08/2026", hospital: "envision", payment: "Insurance", amount: 72900, phone: "9326995155" },
    { name: "Pratik Singh Roy", opd: "03/04/2026", ipd: "04/09/2026", hospital: "Bharti eye hospital Prime", payment: "Insurance", amount: 80500, phone: "8588846611" },
    { name: "Dhiraj Kumar", opd: "21/07/2026", ipd: "04/09/2026", hospital: "Eye Veda Eye hospital Prime", payment: "Insurance", amount: 650000, phone: "8527372764" },
    { name: "Dhiraj Kumar", opd: "21/07/2026", ipd: "05/09/2026", hospital: "Eye Veda Eye hospital Prime", payment: "Insurance", amount: 650000, phone: "8527372764" }
];

async function main() {
    // Process duplicates
    const patientMap = new Map();
    for (const p of patients) {
        if (patientMap.has(p.phone)) {
            const existing = patientMap.get(p.phone);
            existing.amount += p.amount; // Sum the amounts for 2nd eye
            existing.ipd += ` & ${p.ipd} (2nd Eye)`;
            existing.notes = (existing.notes || "") + `\n- Cataract 2nd eye surgery completed on ${p.ipd}.`;
        } else {
            patientMap.set(p.phone, { ...p });
        }
    }

    const uniquePatients = Array.from(patientMap.values());

    for (const p of uniquePatients) {
        
        let notes = `[IPD Record]\n`;
        notes += `Hospital: ${p.hospital}\n`;
        notes += `Payment Type: ${p.payment}\n`;
        notes += `OPD Date: ${p.opd}\n`;
        notes += `Surgery (IPD) Date(s): ${p.ipd}\n`;
        if (p.notes) notes += p.notes + `\n`;

        // Check if hospital exists to link
        let hospitalId = null;
        const h = await prisma.hospital.findFirst({
            where: { name: { contains: p.hospital.split(' ')[0], mode: 'insensitive' } }
        });
        if (h) hospitalId = h.id;

        // Parse OPD Date for the system field
        let opdDateObj = null;
        if (p.opd) {
            const parts = p.opd.split('/');
            if (parts.length === 3) {
                opdDateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T10:00:00Z`);
            }
        }

        const existingLead = await prisma.lead.findFirst({
            where: { phone: { endsWith: p.phone.slice(-10) } }
        });

        if (existingLead) {
            await prisma.lead.update({
                where: { id: existingLead.id },
                data: {
                    status: 'SURGERY_DONE',
                    notes: (existingLead.notes ? existingLead.notes + '\n\n' : '') + notes,
                    revenue: (existingLead.revenue || 0) + p.amount,
                    opdDate: opdDateObj || existingLead.opdDate,
                    hospitalId: hospitalId || existingLead.hospitalId
                }
            });
            console.log(`Updated existing lead to SURGERY_DONE: ${p.name}`);
        } else {
            const referenceId = `HE-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            await prisma.lead.create({
                data: {
                    referenceId,
                    fullName: p.name,
                    phone: p.phone,
                    city: 'Unknown',
                    status: 'SURGERY_DONE',
                    notes: notes,
                    revenue: p.amount,
                    opdDate: opdDateObj,
                    sourcePage: 'Manual Import',
                    description: 'Added via IPD Record Import',
                    hospitalId
                }
            });
            console.log(`Created new lead as SURGERY_DONE: ${p.name}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
