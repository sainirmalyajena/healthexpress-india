import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed Punjab and Rajasthan doctors...');

    // PUNJAB (Chandigarh)
    let punjabHospital = await prisma.hospital.findFirst({
        where: { city: 'Chandigarh', name: { contains: 'ASG' } }
    });

    if (!punjabHospital) {
        console.log('Chandigarh ASG Hospital not found! Creating one...');
        punjabHospital = await prisma.hospital.upsert({
            where: { email: 'chandigarh.punjab@asgeyehospital.com' },
            update: {},
            create: {
                name: 'ASG Eye Hospital - Chandigarh',
                city: 'Chandigarh',
                email: 'chandigarh.punjab@asgeyehospital.com',
                specialties: ['Ophthalmology', 'LASIK', 'Cataract', 'Glaucoma', 'Retina'],
            }
        });
    }

    const punjabDoctors = [
        { name: 'Dr. Megha Gulati', qualification: 'MBBS, DNB(OPHTHALMOLOGY) FLVPEI', experience: 3, about: 'VITREO RETINA & UVEITIS SPECIALIST', email: 'megha.gulati@healthexpress.in', specialties: ['Retina'] },
        { name: 'Dr. Rohit Dureja', qualification: 'MBBS, MS, FICO (UK), FLVPEI', experience: 10, about: 'CATARACT, CORNEA & REFRACTIVE (LASIK) SPECIALIST', email: 'rohit.dureja@healthexpress.in', specialties: ['Cataract', 'Cornea', 'Refractive Surgery', 'LASIK'] },
        { name: 'Dr. Ajoy Singh Virdi', qualification: 'MBBS, DNB (Ophthalmology)', experience: 19, about: 'PHACO, CORNEA & REFRACTIVE (Q-LASIK, ICL & BIOPTICS)', email: 'ajoy.virdi@healthexpress.in', specialties: ['Cataract', 'Cornea', 'Refractive Surgery', 'LASIK'] },
        { name: 'Dr. Jayendra Ailawadhi', qualification: 'MBBS, DNB, MNAMS & FVEIRC', experience: 11, about: 'VITREO-RETINA, PHACO, LASIK, ICL (REFRACTIVE SURGERIES)', email: 'jayendra.ailawadhi@healthexpress.in', specialties: ['Retina', 'Cataract', 'LASIK', 'Refractive Surgery'] },
        { name: 'Dr. Nikita Goel', qualification: 'MBBS, MS, FICO (UK), FMRF', experience: 5, about: 'Consultant – Vitreo-Retina & Uvea Specialist', email: 'nikita.goel@healthexpress.in', specialties: ['Retina'] },
        { name: 'Dr. Sumit Gupta', qualification: 'MBBS, MD (AIIMS, NEW DELHI)', experience: 7, about: 'PHACO, OCULOPLASTY, SQUINT AND REFRACTIVE SURGERIES', email: 'sumit.gupta@healthexpress.in', specialties: ['Cataract', 'Oculoplasty', 'Squint', 'Refractive Surgery'] }
    ];

    let pInserted = 0;
    for (const doc of punjabDoctors) {
        const { specialties, ...doctorData } = doc;
        await prisma.doctor.upsert({
            where: { email: doc.email },
            update: {},
            create: {
                ...doctorData,
                hospitalId: punjabHospital.id,
                image: '/doctors/default.jpg'
            }
        });
        pInserted++;
    }

    // RAJASTHAN (Jaipur)
    let rajasthanHospital = await prisma.hospital.findFirst({
        where: { city: 'Jaipur', name: { contains: 'ASG' } }
    });

    if (!rajasthanHospital) {
        console.log('Jaipur ASG Hospital not found! Creating one...');
        rajasthanHospital = await prisma.hospital.upsert({
            where: { email: 'jaipur.rajasthan@asgeyehospital.com' },
            update: {},
            create: {
                name: 'ASG Eye Hospital - Jaipur',
                city: 'Jaipur',
                email: 'jaipur.rajasthan@asgeyehospital.com',
                specialties: ['Ophthalmology', 'LASIK', 'Cataract', 'Glaucoma', 'Retina'],
            }
        });
    }

    const rajasthanDoctors = [
        { name: 'Dr. Abhijeet Beniwal', qualification: 'MBBS, MD (AIIMS New Delhi) FAICO', experience: 8, about: 'Cornea, Cataract, Refractive Surgery and Ocular Oncology', email: 'abhijeet.beniwal@healthexpress.in', specialties: ['Cornea', 'Cataract', 'Refractive Surgery', 'LASIK'] },
        { name: 'Dr. Ajeet Jakhar', qualification: 'MBBS, MS (OPHTHALMOLOGY)', experience: 39, about: 'SENIOR CONSULTANT PHACO AND REFRACTIVE', email: 'ajeet.jakhar@healthexpress.in', specialties: ['Cataract', 'Refractive Surgery'] },
        { name: 'Dr. Amit Kumar Sharma', qualification: 'MBBS, DNB (OPHTHALMOLOGY)', experience: 3, about: 'PHACO AND REFRACTIVE EYE SURGEON', email: 'amit.sharma@healthexpress.in', specialties: ['Cataract', 'Refractive Surgery'] },
        { name: 'Dr. Anita Yadav', qualification: 'MBBS, MS', experience: 6, about: 'PHACO', email: 'anita.yadav@healthexpress.in', specialties: ['Cataract'] },
        { name: 'Dr. Anju Bhari', qualification: 'MBBS, MD (AIIMS, NEW DELHI), DNB, MNAMS', experience: 3, about: 'PHACO, STRABISMUS & OCULOPLASTY', email: 'anju.bhari@healthexpress.in', specialties: ['Cataract', 'Squint', 'Oculoplasty'] },
        { name: 'Dr. Annu Chahar', qualification: 'MBBS, DNB, FVRS', experience: 0, about: 'Consultant Vitreo Retina & Phaco surgeon', email: 'annu.chahar@healthexpress.in', specialties: ['Retina', 'Cataract'] },
        { name: 'Dr. Anshuman Gahlot', qualification: 'MBBS, MS & FVRS (OPHTHALMOLOGY)', experience: 8, about: 'VITREO RETINA, UVEA & ROP', email: 'anshuman.gahlot@healthexpress.in', specialties: ['Retina'] },
        { name: 'Dr. Anubhav Upadhyay', qualification: 'MBBS, MS, FVRS, FICO (UK) FAICO', experience: 11, about: 'RETINA', email: 'anubhav.upadhyay@healthexpress.in', specialties: ['Retina'] },
        { name: 'Dr. Arun Singhvi', qualification: 'MBBS, MD (AIIMS, NEW DELHI) & FRCS (A)', experience: 23, about: 'PHACO, FEMTO, CORNEA & REFRACTIVE', email: 'arun.singhvi@healthexpress.in', specialties: ['Cataract', 'Cornea', 'Refractive Surgery', 'LASIK'] },
        { name: 'Dr. Ashish Agarwal', qualification: 'MBBS, MD (AIIMS, NEW DELHI)', experience: 19, about: 'CATARACT AND REFRACTIVE SURGEON AND GLAUCOMA', email: 'ashish.agarwal@healthexpress.in', specialties: ['Cataract', 'Refractive Surgery', 'LASIK', 'Glaucoma'] }
    ];

    let rInserted = 0;
    for (const doc of rajasthanDoctors) {
        const { specialties, ...doctorData } = doc;
        await prisma.doctor.upsert({
            where: { email: doc.email },
            update: {},
            create: {
                ...doctorData,
                hospitalId: rajasthanHospital.id,
                image: '/doctors/default.jpg'
            }
        });
        rInserted++;
    }

    const allDocs = [...punjabDoctors, ...rajasthanDoctors];

    // Link them to LASIK surgery for the campaign page
    const lasik = await prisma.surgery.findFirst({ where: { slug: 'lasik-eye-surgery' }});
    if (lasik) {
        for (const doc of allDocs) {
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
        for (const doc of allDocs) {
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

    console.log(`Successfully seeded ${pInserted} real doctors for Punjab and ${rInserted} for Rajasthan!`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
