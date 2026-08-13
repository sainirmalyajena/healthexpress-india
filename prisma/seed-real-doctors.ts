import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed real doctors...');

    let delhiHospital = await prisma.hospital.findFirst({
        where: { city: 'Delhi', name: { contains: 'ASG' } }
    });

    if (!delhiHospital) {
        console.error('Delhi ASG Hospital not found! Creating one...');
        delhiHospital = await prisma.hospital.create({
            data: {
                name: 'ASG Eye Hospital - Delhi',
                city: 'Delhi',
                email: 'delhi@asgeyehospital.com',
                specialties: ['Ophthalmology', 'LASIK', 'Cataract', 'Glaucoma', 'Retina'],
            }
        });
    }

    const hospitalId = delhiHospital.id;

    const realDoctors = [
        {
            name: 'Dr. Devansh Talati',
            qualification: 'MBBS, MS, FELLOWSHIP GLAUCOMA',
            experience: 12,
            about: 'Specialist in Glaucoma and Pediatric Ophthalmology.',
            email: 'devansh.talati@healthexpress.in',
            specialties: ['Glaucoma', 'Pediatric Ophthalmology'],
        },
        {
            name: 'Dr. S.C. Narang',
            qualification: 'MBBS, MS, FELLOW VITREO RETINAL (SANKARA NETHRALAYA), FELLOW FICO (JAPAN)',
            experience: 25,
            about: 'Sr. Consultant Anterior Segment, Cataract Surgery & Retina, Sr. Consultant LASIK.',
            email: 'sc.narang@healthexpress.in',
            specialties: ['LASIK', 'Cataract', 'Retina', 'Anterior Segment'],
        },
        {
            name: 'Dr. Sapna Jain',
            qualification: 'MBBS, MS, FELLOWSHIP IN SQUINT AND PEDIATRIC',
            experience: 15,
            about: 'Specialist in Squint, Pediatric Ophthalmology, and Refractive Surgery.',
            email: 'sapna.jain@healthexpress.in',
            specialties: ['Pediatric Ophthalmology', 'Squint', 'Refractive Surgery', 'LASIK'],
        },
        {
            name: 'Dr. Shalini Mittal',
            qualification: 'MBBS, DOMS, FELLOWSHIP IN CATARACT SURGERY',
            experience: 18,
            about: 'Specialist in Phaco & Refractive Surgery.',
            email: 'shalini.mittal@healthexpress.in',
            specialties: ['Cataract', 'Phaco', 'Refractive Surgery', 'LASIK'],
        }
    ];

    let inserted = 0;
    for (const doc of realDoctors) {
        // We extract specialties out so it's not passed to the DB directly since it's not a column on Doctor
        const { specialties, ...doctorData } = doc;
        await prisma.doctor.upsert({
            where: { email: doc.email },
            update: {},
            create: {
                ...doctorData,
                hospitalId,
                image: '/doctors/default.jpg'
            }
        });
        inserted++;
    }

    // Link them to LASIK surgery for the campaign page
    const lasik = await prisma.surgery.findFirst({ where: { slug: 'lasik-eye-surgery' }});
    if (lasik) {
        for (const doc of realDoctors) {
            const dbDoc = await prisma.doctor.findUnique({ where: { email: doc.email }});
            if (dbDoc && (doc.specialties.includes('LASIK') || doc.specialties.includes('Refractive Surgery'))) {
                await prisma.surgery.update({
                    where: { id: lasik.id },
                    data: {
                        doctors: { connect: { id: dbDoc.id } }
                    }
                });
            }
        }
    }

    console.log(`Successfully seeded ${inserted} real doctors for Delhi!`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
