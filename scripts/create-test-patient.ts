import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('Creating test patient lead...');

    // 1. Ensure a Surgery exists
    let surgery = await prisma.surgery.findFirst();
    if (!surgery) {
        surgery = await prisma.surgery.create({
            data: {
                name: 'Knee Replacement',
                slug: 'knee-replacement',
                category: 'ORTHOPEDICS',
                overview: 'Surgery to replace knee joint.',
                indications: 'Severe pain',
                procedure: 'Arthroplasty',
                duration: '2 hours',
                hospitalStay: '3 days',
                recovery: '4 weeks',
                risks: 'Infection',
                preparation: 'Fast for 12 hours',
                postOpCare: 'Physiotherapy',
                costRangeMin: 150000,
                costRangeMax: 250000,
                symptoms: ['Knee pain'],
                availableCities: ['Bangalore']
            }
        });
    }

    // 2. Create/Update Lead
    const phone = '9999999999';
    let lead = await prisma.lead.findFirst({
        where: { phone: { contains: phone } }
    });

    if (lead) {
        console.log(`Updating existing lead: ${lead.fullName}`);
        lead = await prisma.lead.update({
            where: { id: lead.id },
            data: {
                fullName: 'Rahul Sharma',
                status: 'OPD_SCHEDULED', // To show some timeline progress
                surgeryId: surgery.id
            }
        });
    } else {
        console.log('Creating new test lead');
        lead = await prisma.lead.create({
            data: {
                fullName: 'Rahul Sharma',
                phone: phone,
                email: 'rahul@example.com',
                city: 'Bangalore',
                description: 'Knee pain',
                surgeryId: surgery.id,
                status: 'OPD_SCHEDULED',
                referenceId: 'REF-' + Date.now(),
                sourcePage: 'test-script'
            }
        });
    }

    console.log('================================');
    console.log('Test Patient Generated:');
    console.log(`Name: ${lead.fullName}`);
    console.log(`Phone: ${phone}`);
    console.log(`OTP for login: 123456`);
    console.log('Login at: /patient/login');
    console.log('================================');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
