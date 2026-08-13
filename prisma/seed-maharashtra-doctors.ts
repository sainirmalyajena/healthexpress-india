import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed real Maharashtra doctors...');

    let mumbaiHospital = await prisma.hospital.findFirst({
        where: { city: 'Mumbai', name: { contains: 'ASG' } }
    });

    if (!mumbaiHospital) {
        console.log('Mumbai ASG Hospital not found! Creating one...');
        mumbaiHospital = await prisma.hospital.create({
            data: {
                name: 'ASG Eye Hospital - Mumbai',
                city: 'Mumbai',
                email: 'mumbai@asgeyehospital.com',
                specialties: ['Ophthalmology', 'LASIK', 'Cataract', 'Glaucoma', 'Retina'],
            }
        });
    }

    const hospitalId = mumbaiHospital.id;

    const doctors = [
        { name: 'Dr. Shirish Patel', qualification: 'MBBS, DNB', experience: 10, about: 'Specialist in Cataract and Lasik Surgeon', email: 'shirish.patel@healthexpress.in', specialties: ['Cataract', 'LASIK'] },
        { name: 'Dr. Ameeta Shirodkar', qualification: 'MBBS, DNB, FICO', experience: 12, about: 'Specialist in CATARACT AND ANTERIOR SEGMENT SURGEON', email: 'ameeta.shirodkar@healthexpress.in', specialties: ['Cataract', 'Anterior Segment'] },
        { name: 'Dr. Amit H. Pathak', qualification: 'MBBS, MS (Ophthalmology), DNB (Ophthalmology), FAEH (Glaucoma)', experience: 10, about: 'Specialist in Phaco and Glaucoma Surgeon', email: 'amit.pathak@healthexpress.in', specialties: ['Cataract', 'Glaucoma'] },
        { name: 'Dr. Amol Chaudhari', qualification: 'MBBS, DOMS, DNB (NEW DELHI) FICO', experience: 9, about: 'Specialist in CATARACT MICROSURGERY & GLAUCOMA FELLOWSHIP', email: 'amol.chaudhari@healthexpress.in', specialties: ['Cataract', 'Glaucoma'] },
        { name: 'Dr. Ankita Gaunekar Bhangui', qualification: 'MBBS MS PHACO FELLOW', experience: 8, about: 'Specialist in CATARACT & ANTERIOR SEGMENT SURGEON', email: 'ankita.bhangui@healthexpress.in', specialties: ['Cataract', 'Anterior Segment'] },
        { name: 'Dr. Anup Ashok Sadafale', qualification: 'MBBS, DNB (OPHTHALMOLOGY)', experience: 10, about: 'Specialist in CATARACT, GLAUCOMA & REFRACTIVE SPECIALIST', email: 'anup.sadafale@healthexpress.in', specialties: ['Cataract', 'Glaucoma', 'Refractive Surgery', 'LASIK'] },
        { name: 'Dr. Bhupesh P. Jain', qualification: 'MBBS, DNB, FELLOWSHIP IN CORNEA & REFRACTIVE SURGERIES', experience: 15, about: 'Specialist in CATARACT, LASIK, CORNEA CONSULTANT', email: 'bhupesh.jain@healthexpress.in', specialties: ['Cataract', 'LASIK', 'Cornea'] },
        { name: 'Dr. Farin Shaikh', qualification: 'MBBS, MD (AIIMS, NEW DELHI)', experience: 8, about: 'Specialist in PHACO, LASIK & CORNEA', email: 'farin.shaikh@healthexpress.in', specialties: ['Cataract', 'LASIK', 'Cornea'] },
        { name: 'Dr. Gul J. Nankani', qualification: 'MBBS, MS (OPHTHALMOLOGY)', experience: 14, about: 'Specialist in CATARACT AND REFRACTIVE, LASIK, GLAUCOMA', email: 'gul.nankani@healthexpress.in', specialties: ['Cataract', 'Refractive Surgery', 'LASIK', 'Glaucoma'] },
        { name: 'Dr. Harish Pathak', qualification: 'MBBS, MD (AIIMS, NEW DELHI), DNB, MNAMS, FRCS, FICO (UK)', experience: 22, about: 'Specialist in PHACO-REFRACTIVE, STRABISMUS, OCULOPLASTY', email: 'harish.pathak@healthexpress.in', specialties: ['Cataract', 'Refractive Surgery', 'LASIK', 'Squint'] },
        { name: 'Dr. Harshaverdhan Reddy C.', qualification: 'MBBS, MS, FVRS', experience: 7, about: 'Specialist in VITREO-RETINA AND UVEA', email: 'harshaverdhan.reddy@healthexpress.in', specialties: ['Retina'] },
        { name: 'Dr. Hemangi Methe Chatterjee', qualification: 'MBBS, DOMS, DNB, FICO (UK)', experience: 11, about: 'Specialist in PHACO', email: 'hemangi.chatterjee@healthexpress.in', specialties: ['Cataract'] },
        { name: 'Dr. Hemant Chasia', qualification: 'MBBS, MS (Ophthalmology), DOMS', experience: 31, about: 'Specialist in General Ophthalmology, Phaco Cataract, Refractive LASIK', email: 'hemant.chasia@healthexpress.in', specialties: ['Cataract', 'Refractive Surgery', 'LASIK', 'Ophthalmology'] },
        { name: 'Dr. Himanshu Mehta', qualification: 'MBBS, MS (Ophthalmology), DOMS', experience: 30, about: 'Specialist in Cataract, Phacoemulsification, LASIK, and Vitreo-Retinal surgeries', email: 'himanshu.mehta@healthexpress.in', specialties: ['Cataract', 'LASIK', 'Retina'] },
        { name: 'Dr. Jatin Ashar', qualification: 'MD (AIIMS), DNB, FICO (UK), and FAICO', experience: 18, about: 'Specialist in Cataract, Cornea, and Refractive Surgery', email: 'jatin.ashar@healthexpress.in', specialties: ['Cataract', 'Cornea', 'Refractive Surgery', 'LASIK'] }
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

    console.log(`Successfully seeded ${inserted} real doctors for Maharashtra!`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
