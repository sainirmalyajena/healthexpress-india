const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function addDoctors() {
    const hospitalId = "cmtifglg60003wg20e1i5h4py"; // Sharp Sight Eye Hospital

    // Surgeries
    const cataractId = 'cmt1dh3d1001ywgnsxfauic5w';
    const lasikId = 'cmt1dh42o001zwgnsm27dt1ma';
    const glaucomaId = 'cmt1dh4to0020wgnsh08orkpd';
    const corneaId = 'cmt1dh9op0026wgnssj3isefa';

    // Dr. Divya Jain
    const divya = await prisma.doctor.create({
        data: {
            name: "Dr. Divya Jain",
            qualification: "MBBS, MS (Ophthal), DNB, Fellowship in Cornea and Refractive services, FICO (Ophthal)",
            experience: 14,
            about: "Dr. Divya Jain is a Consultant at Sharp Sight Eye Hospitals. She has completed her MBBS from Lady Hardinge Medical College, New Delhi and MS (Ophthal) from UCMS & Guru Teg Bahadur Hospital, New Delhi. She has also done her Fellowship in Cornea & Refractive Services from Sadguru Netra Chikitsalya, Chitrakoot. She has presented research papers at National conferences and published in peer-reviewed journals, reflecting her commitment to evidence-based practice and continuous learning.",
            image: "https://healthexpressindia.com/default-doctor.jpg",
            isVerified: true,
            accreditations: ["FICO", "DNB"],
            email: "divya.jain@sharpsight.in",
            hospitalId: hospitalId,
            surgeries: {
                connect: [{ id: cataractId }, { id: lasikId }, { id: corneaId }]
            }
        }
    });
    console.log("Added Dr. Divya Jain:", divya.id);

    // Dr. Shantanu Mukherji
    const shantanu = await prisma.doctor.create({
        data: {
            name: "Dr. (Lt. Col) Shantanu Mukherji",
            qualification: "MBBS, MS Ophthalmology",
            experience: 33,
            about: "Dr. Shantanu Mukherji completed his medical education (MBBS, MS) from the prestigious Armed Forces Medical College (AFMC), Pune. He has been trained in adult glaucoma and refractive surgery from reputed international institutes. He has over 22 Years expertise in eye care. He has credit many presentations at national and international conferences to his credit.",
            image: "https://healthexpressindia.com/default-doctor.jpg",
            isVerified: true,
            accreditations: ["Asia-Pacific Association of Cataract & Refractive Surgeons", "All India Ophthalmological Society", "Glaucoma Society of India", "Delhi Ophthalmological Society"],
            email: "shantanu.mukherji@sharpsight.in",
            hospitalId: hospitalId,
            surgeries: {
                connect: [{ id: glaucomaId }, { id: cataractId }, { id: lasikId }]
            }
        }
    });
    console.log("Added Dr. Shantanu Mukherji:", shantanu.id);
}

addDoctors().catch(console.error).finally(() => prisma.$disconnect());
