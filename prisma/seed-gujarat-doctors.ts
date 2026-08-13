import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed real Gujarat doctors...');

    let gujaratHospital = await prisma.hospital.findFirst({
        where: { city: 'Ahmedabad', name: { contains: 'ASG' } }
    });

    if (!gujaratHospital) {
        console.log('Ahmedabad ASG Hospital not found! Creating one...');
        gujaratHospital = await prisma.hospital.create({
            data: {
                name: 'ASG Eye Hospital - Ahmedabad',
                city: 'Ahmedabad',
                email: 'ahmedabad@asgeyehospital.com',
                specialties: ['Ophthalmology', 'LASIK', 'Cataract', 'Glaucoma', 'Retina'],
            }
        });
    }

    const hospitalId = gujaratHospital.id;

    const doctors = [
        { name: 'Dr. Milap Vaghela', qualification: 'MBBS, MS, FLVPEI & FICO (U.K.)', experience: 10, about: 'Specialist in PHACO, REFRACTIVE (Q-LASIK, ICL & BIOPTICS) & GLAUCOMA', email: 'milap.vaghela@healthexpress.in', specialties: ['LASIK', 'Refractive Surgery', 'Glaucoma', 'Cataract'] },
        { name: 'Dr. Alap Bavishi', qualification: 'MBBS, DO, FAEH, FMR', experience: 10, about: 'Specialist in Cataract, Refractive, oculoplasty, Medical Retina', email: 'alap.bavishi@healthexpress.in', specialties: ['Cataract', 'Refractive Surgery', 'Retina', 'LASIK'] },
        { name: 'Dr. Arjun Desai', qualification: 'M.D. (AIIMS, New Delhi)', experience: 5, about: 'Specialist in FLVPEI - Retina and Vitreous', email: 'arjun.desai@healthexpress.in', specialties: ['Retina'] },
        { name: 'Dr. Bela Sharma', qualification: 'MBBS, DO, MS', experience: 26, about: 'Specialist in Lasik, Refractive', email: 'bela.sharma@healthexpress.in', specialties: ['LASIK', 'Refractive Surgery'] },
        { name: 'Dr. Bhavik Panchal', qualification: 'MBBS, DNB, FICO, FLVPEI', experience: 11, about: 'Specialist in Cataract, Vitreoretina, Uveitis and ROP', email: 'bhavik.panchal@healthexpress.in', specialties: ['Cataract', 'Retina'] },
        { name: 'Dr. Bhavya Gokani', qualification: 'MBBS, DO, DNB, FIOL, FAICO', experience: 7, about: 'Specialist in Cataract, Refractive and Glaucoma', email: 'bhavya.gokani@healthexpress.in', specialties: ['Cataract', 'Refractive Surgery', 'Glaucoma', 'LASIK'] },
        { name: 'Dr. Darshin Bavishi', qualification: 'MBBS, DO, MS, FRCS', experience: 28, about: 'Specialist in Cataract, Refractive and Glaucoma', email: 'darshin.bavishi@healthexpress.in', specialties: ['Cataract', 'Refractive Surgery', 'Glaucoma', 'LASIK'] },
        { name: 'Dr. Girish Jethwa', qualification: 'Master Of Surgery (M. S. ophthalmology)', experience: 42, about: 'Specialist in cataract surgery, LASIK, and retinal treatments', email: 'girish.jethwa@healthexpress.in', specialties: ['Cataract', 'LASIK', 'Retina'] },
        { name: 'Dr. Ishan Pandya', qualification: 'M.D. (AIIMS, New Delhi)', experience: 5, about: 'Specialist in Ophthalmology', email: 'ishan.pandya@healthexpress.in', specialties: ['Ophthalmology', 'Cataract'] },
        { name: 'Dr. Mahesh Pandya', qualification: 'M.S. Ophthalmology', experience: 10, about: 'Specialist in M.S. Ophthalmology', email: 'mahesh.pandya@healthexpress.in', specialties: ['Ophthalmology'] },
        { name: 'Dr. Mahesh Shivsharan Singh', qualification: 'MBBS, MS, Fellowship in Medical Retina & Uveitis', experience: 5, about: 'Specialist in Medical Retina, Surgical Retina, Vitreoretinal Surgery & Uveitis', email: 'mahesh.singh@healthexpress.in', specialties: ['Retina'] },
        { name: 'Dr. Mayur Shah', qualification: 'M.B.B.S. and M.S. (Ophthalmology)', experience: 26, about: 'Specialist in Cataract Surgery, Glaucoma Management, Refractive Surgery (LASIK, ICL)', email: 'mayur.shah@healthexpress.in', specialties: ['Cataract', 'Glaucoma', 'Refractive Surgery', 'LASIK'] },
        { name: 'Dr. Pooja Patel', qualification: 'MBBS, MS (Ophthalmology)', experience: 4, about: 'Specialist in FPOSN (Pediatric, Squint and Neuro-Ophthalmology) , Pediatric Ophthalmologist', email: 'pooja.patel@healthexpress.in', specialties: ['Pediatric Ophthalmology', 'Squint'] },
        { name: 'Dr. Raghav Ravani', qualification: 'MBBS, MD (AIIMS NEW DELHI)', experience: 11, about: 'Specialist in PHACO, VITREO-RETINA, UVEA & ROP', email: 'raghav.ravani@healthexpress.in', specialties: ['Cataract', 'Retina'] },
        { name: 'Dr. Shailen Patel', qualification: 'MBBS, DNB ( OPHTHALMOLOGY)', experience: 9, about: 'Specialist in CATARACT SURGERY (PHACOEMULSIFICATION, FEMTOCATARACT), REFRACTIVE SURGERY (LASIK, FEMTOLASIK, ICL, BIOPTICS, C3R)', email: 'shailen.patel@healthexpress.in', specialties: ['Cataract', 'Refractive Surgery', 'LASIK'] },
        { name: 'Dr. Snehal Ganatra Panchal', qualification: 'MBBS, MS, DNB, FICO, FAEH', experience: 8, about: 'Specialist in Cataract, Pediatric and Neuro - Ophthalmology', email: 'snehal.panchal@healthexpress.in', specialties: ['Cataract', 'Pediatric Ophthalmology'] },
        { name: 'Dr. Suba Roniak Dineshbhai', qualification: 'MBBS, DNB (Ophthalmology)', experience: 6, about: 'Consultant Ophthalmologist - Cornea, Cataract & Refractive Surgery', email: 'suba.dineshbhai@healthexpress.in', specialties: ['Cornea', 'Cataract', 'Refractive Surgery', 'LASIK'] },
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

    console.log(`Successfully seeded ${inserted} real doctors for Gujarat!`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
