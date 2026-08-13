import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed real Odisha doctors...');

    let bhubaneswarHospital = await prisma.hospital.findFirst({
        where: { city: 'Bhubaneswar', name: { contains: 'ASG' } }
    });

    if (!bhubaneswarHospital) {
        console.log('Bhubaneswar ASG Hospital not found! Creating one...');
        bhubaneswarHospital = await prisma.hospital.upsert({
            where: { email: 'bhubaneswar.odisha@asgeyehospital.com' },
            update: {},
            create: {
                name: 'ASG Eye Hospital - Bhubaneswar',
                city: 'Bhubaneswar',
                email: 'bhubaneswar.odisha@asgeyehospital.com',
                specialties: ['Ophthalmology', 'LASIK', 'Cataract', 'Glaucoma', 'Retina'],
            }
        });
    }

    const hospitalId = bhubaneswarHospital.id;

    const doctors = [
        { name: 'Dr. Akshay Kumar Panda', qualification: 'MBBS, MS (OPHTHALMOLOGY)', experience: 47, about: 'Specialist in PEDIATRIC & MEDICAL RETINA', email: 'akshay.panda@healthexpress.in', specialties: ['Retina', 'Pediatric Ophthalmology'] },
        { name: 'Dr. Bighnaraj Pal', qualification: 'MBBS, MS & CORNEA FELLOW (AECS)', experience: 14, about: 'Specialist in PHACO, CORNEA & ANTERIOR SEGMENT EXPERT', email: 'bighnaraj.pal@healthexpress.in', specialties: ['Cataract', 'Cornea', 'Anterior Segment'] },
        { name: 'Dr. Chinmayee Pardhan', qualification: 'MBBS, MS, FAECS', experience: 8, about: 'Specialist in GLAUCOMA & CATARACT', email: 'chinmayee.pardhan@healthexpress.in', specialties: ['Glaucoma', 'Cataract'] },
        { name: 'Dr. Monalisha Pattnaik', qualification: 'MBBS, MS & FELLOWSHIP IN OPHTHALMIC PLASTIC SURGERY, OCULAR ONCOLOGY', experience: 7, about: 'Specialist in OCULAR AESTHETIC, OCULAR ONCOLOGY, OCULAR TRAUMA, SOCKET RECONSTRUCTION, DACRYOLOGY', email: 'monalisha.pattnaik@healthexpress.in', specialties: ['Ocular Oncology', 'Oculoplasty'] },
        { name: 'Dr. Pallavi Ray', qualification: 'MBBS, MS, DNB, FLVPEI (Glaucoma)', experience: 5, about: 'Glaucoma Specialist | Cataract Surgeon', email: 'pallavi.ray@healthexpress.in', specialties: ['Glaucoma', 'Cataract'] },
        { name: 'Dr. Rahul Saini', qualification: 'MBBS, MS, DNB OPHTHALMOLOGY, PHACO FELLOWSHIP', experience: 0, about: 'CATARACT AND ANTERIOR SEGMENT SURGEON', email: 'rahul.saini@healthexpress.in', specialties: ['Cataract', 'Anterior Segment'] },
        { name: 'Dr. Raja Agarwal', qualification: 'MBBS, MS (OPHTHALMOLOGIST) FICS (USA)', experience: 23, about: 'PHACO, CORNEA & REFRACTIVE (Q-LASIK, ICL & BIOPTICS) MEDICAL RETINA, GLAUCOMA AND COMPREHENSIVE EYE CARE SPECIALIST', email: 'raja.agarwal@healthexpress.in', specialties: ['Cataract', 'Cornea', 'Refractive Surgery', 'LASIK', 'Retina', 'Glaucoma'] },
        { name: 'Dr. Sonali Sarangi', qualification: 'MBBS, MS, FELLOWSHIP IN GLAUCOMA, IOL, AND MICROSURGERY', experience: 8, about: 'GLAUCOMA AND IOL', email: 'sonali.sarangi@healthexpress.in', specialties: ['Glaucoma', 'Cataract'] },
    ];

    let inserted = 0;
    for (const doc of doctors) {
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
        for (const doc of doctors) {
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
    
    // Link to Cataract surgery
    const cataract = await prisma.surgery.findFirst({ where: { slug: 'cataract-surgery' }});
    if (cataract) {
        for (const doc of doctors) {
            const dbDoc = await prisma.doctor.findUnique({ where: { email: doc.email }});
            if (dbDoc && doc.specialties.includes('Cataract')) {
                await prisma.surgery.update({
                    where: { id: cataract.id },
                    data: {
                        doctors: { connect: { id: dbDoc.id } }
                    }
                });
            }
        }
    }

    console.log(`Successfully seeded ${inserted} real doctors for Odisha (Bhubaneswar)!`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
