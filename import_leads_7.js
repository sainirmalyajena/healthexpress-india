const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const leadsToImport = [
    {
        name: "Jaspal Tariyal", phone: "9867785533", city: "Mumbai", hospitalName: "ASG Vashi", surgery: "Lasik", insuranceStr: "Corporate",
        remarks: "Age 42, have corporate policy,Vashi hospital detils share,followup for tomorrow",
        followUpDate: "2026-09-08T10:00:00Z",
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    },
    {
        name: "Pooja Kshirsagar", phone: "8879098804", city: "Mumbai", hospitalName: "MEC", surgery: "Lasik", insuranceStr: "Cash",
        remarks: "Age 29, power -2, Cash pt, Lasik 40-70k pitch, asked to me call for tomorrow",
        followUpDate: "2026-09-08T10:00:00Z",
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    },
    {
        name: "Shrikant Toke", phone: "7208810454", city: "Mumbai", hospitalName: "ASG Kalyan", surgery: "Lasik", insuranceStr: "Corporate",
        remarks: "Age 35, power -3, tata aig corporate,Plan of OPD in Diwali",
        followUpDate: "2026-10-01T10:00:00Z", // Diwali is late oct/nov, setting Oct 1 as a baseline followup
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    },
    {
        name: "Shailesh Pokharkar", phone: "9920804142", city: "Mumbai", hospitalName: "", surgery: "", insuranceStr: "Cash",
        remarks: "Age 44, power -1.5, Lokhandwala, Asked to me call on tomorrow",
        followUpDate: "2026-09-08T10:00:00Z",
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    },
    {
        name: "Aman Sharma", phone: "7350367212", city: "Sinnar", hospitalName: "ASG Pimpri", surgery: "Lasik", insuranceStr: "EMI",
        remarks: "8pm followup",
        // 8pm IST = 14:30 UTC
        followUpDate: "2026-09-07T14:30:00Z", 
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    },
    {
        name: "Surinder Sethi", phone: "9654197959", city: "Delhi", hospitalName: "", surgery: "Lasik", insuranceStr: "Individual",
        remarks: "age 42, power -1.25, TilakNagar, Have Reliance Individual policy, hospital detais share, let me know tomorrow",
        followUpDate: "2026-09-08T10:00:00Z",
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    },
    {
        name: "Sujit Raman Joshi", phone: "9220219444", city: "Mumbai", hospitalName: "", surgery: "", insuranceStr: "",
        remarks: "asked to me call 3pm",
        // 3pm IST = 09:30 UTC
        followUpDate: "2026-09-07T09:30:00Z",
        assignedUserId: "cmtjtlphm0000wgekj9fs4xj7"
    }
];

async function main() {
    for (const lead of leadsToImport) {
        
        let notes = `[Manual Import]\n`;
        if (lead.hospitalName) notes += `Hospital: ${lead.hospitalName}\n`;
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
                    status: 'FOLLOW_UP',
                    notes: (existingLead.notes ? existingLead.notes + '\n\n' : '') + notes,
                    followUpDate: lead.followUpDate ? new Date(lead.followUpDate) : existingLead.followUpDate,
                    assignedUserId: lead.assignedUserId,
                    city: lead.city || existingLead.city,
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
                    city: lead.city || "Unknown",
                    status: 'FOLLOW_UP',
                    notes: notes,
                    followUpDate: lead.followUpDate ? new Date(lead.followUpDate) : null,
                    sourcePage: 'Manual Import',
                    description: lead.remarks || 'Added via chat manual import',
                    assignedUserId: lead.assignedUserId,
                    surgeryId
                }
            });
            console.log(`Created new lead: ${lead.name}`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
