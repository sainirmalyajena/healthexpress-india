const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const leadsToImport = [
    {
        name: "Rushikesh Joshi",
        phone: "7710887531",
        city: "Mumbai",
        hospitalName: "ASG Vashi",
        opdDateStr: "11/09/2026",
        surgery: "Lasik",
        insuranceStr: "Star Corporate",
        remarks: "Age 28, power -3, Star heath policy, opd booked for 11th Sept",
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    },
    {
        name: "Balram",
        phone: "8607676400",
        city: "Gurgaon",
        hospitalName: "Sight Avenue",
        opdDateStr: "10/09/2026",
        surgery: "Cataract",
        insuranceStr: "Cash",
        remarks: "",
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    },
    {
        name: "Kishansingh Solanki",
        phone: "7773926362",
        city: "Pune",
        hospitalName: "ASG Shiovajinagar",
        opdDateStr: "07/09/2026",
        surgery: "ICL",
        insuranceStr: "Cash",
        remarks: "ICL pt, opd booked for 7th sept Monday",
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    }
];

async function main() {
    for (const lead of leadsToImport) {
        let opdDate = null;
        if (lead.opdDateStr) {
            const parts = lead.opdDateStr.split('/');
            let year = parseInt(parts[2]);
            if (year < 2000) year += 2000;
            opdDate = new Date(`${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}T10:00:00Z`);
        }
        
        let notes = `[Manual Import]\n`;
        if (lead.hospitalName) notes += `Hospital: ${lead.hospitalName}\n`;
        if (lead.opdDateStr) notes += `OPD Date: ${lead.opdDateStr}\n`;
        if (lead.surgery) notes += `Surgery: ${lead.surgery}\n`;
        if (lead.insuranceStr) notes += `Payment/Insurance: ${lead.insuranceStr}\n`;
        if (lead.remarks) notes += `Remarks: ${lead.remarks}\n`;

        // Check if surgery exists
        let surgeryId = null;
        if (lead.surgery) {
            const s = await prisma.surgery.findFirst({
                where: { name: { contains: lead.surgery, mode: 'insensitive' } }
            });
            if (s) surgeryId = s.id;
        }

        const existingLead = await prisma.lead.findFirst({
            where: { phone: lead.phone }
        });

        if (existingLead) {
            await prisma.lead.update({
                where: { id: existingLead.id },
                data: {
                    status: 'OPD_SCHEDULED',
                    notes: (existingLead.notes ? existingLead.notes + '\n\n' : '') + notes,
                    opdDate: opdDate || existingLead.opdDate,
                    assignedUserId: lead.assignedUserId,
                    city: lead.city,
                    surgeryId: surgeryId || existingLead.surgeryId
                }
            });
            console.log(`Updated existing lead: ${lead.name}`);
        } else {
            const referenceId = `HE-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            await prisma.lead.create({
                data: {
                    referenceId,
                    fullName: lead.name,
                    phone: lead.phone,
                    city: lead.city,
                    status: 'OPD_SCHEDULED',
                    notes: notes,
                    opdDate: opdDate,
                    sourcePage: 'Manual Import',
                    description: 'Added via chat manual import',
                    assignedUserId: lead.assignedUserId,
                    surgeryId
                }
            });
            console.log(`Created new lead: ${lead.name}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
