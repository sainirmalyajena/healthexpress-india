const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function addDoctors() {
    const hospitalId = "cmtifglg60003wg20e1i5h4py"; // Sharp Sight Eye Hospital

    const cataractId = 'cmt1dh3d1001ywgnsxfauic5w';
    const lasikId = 'cmt1dh42o001zwgnsm27dt1ma';

    // Dr. Garvita Singh
    const garvita = await prisma.doctor.create({
        data: {
            name: "Dr. Garvita Singh",
            qualification: "MBBS, MS (Ophthal), FICO",
            experience: 13,
            about: "Dr. Garvita is a consultant with Sharp Sight Eye Hospitals. She has completed her MBBS from Indira Gandhi Govt. Medical College, Nagpur, Maharashtra, MS(Ophthal) from Patna Medical College and Hospital, Patna as well as Fellowship in Cataract & Anterior Segment from D.D. Eye Institute, Kota, Rajasthan. She has also done Fellowship in Oculoplasty and Facial Aesthetics. She has 13 years of experience in Femto/phacoemulsification cataract surgery. She also has good experience in medical retina. She has a keen interest in academics and publications.",
            image: "https://healthexpressindia.com/default-doctor.jpg",
            isVerified: true,
            accreditations: [],
            email: "garvita.singh@sharpsight.in",
            hospitalId: hospitalId,
            surgeries: {
                connect: [{ id: cataractId }, { id: lasikId }]
            }
        }
    });
    console.log("Added Dr. Garvita Singh:", garvita.id);

    // Dr. Anurag Wahi
    const anurag = await prisma.doctor.create({
        data: {
            name: "Dr. Anurag Wahi",
            qualification: "MBBS, MS",
            experience: 26,
            about: "Dr. Anurag is senior consultant ophthalmologist and appointed as Medical Superintendent at Sharp Sight (Group of Eye Hospitals), New Delhi. Dr. Anurag has completed his MBBS and MS Ophthalmology from LLRM Medical College, Meerut and senior residency from GTB Hospital, New Delhi. He honed his skills in Phaco Training from I-Care Eye Hospital Noida. Dr. Anurag is a dynamic Lasik surgeon and has performed numerous successful Lasik surgeries. He has been conducting eye awareness programs and clinical talks at various Resident Welfare Associations.",
            image: "https://healthexpressindia.com/default-doctor.jpg",
            isVerified: true,
            accreditations: ["DMC", "DOS"],
            email: "anurag.wahi@sharpsight.in",
            hospitalId: hospitalId,
            surgeries: {
                connect: [{ id: cataractId }, { id: lasikId }]
            }
        }
    });
    console.log("Added Dr. Anurag Wahi:", anurag.id);

    // Dr. Samir Sud
    const samir = await prisma.doctor.create({
        data: {
            name: "Dr. Samir Sud",
            qualification: "MBBS, DNB",
            experience: 39,
            about: "Co-Founder & Medical Director of Sharp Sight Eye Hospitals, Dr Samir has completed his MBBS from Armed Forces Medical College (AFMC) and DNB from NBE, He received his medical & surgical training from AFMC & proceeded for obtaining advanced training from SIR GANGA RAM HOSPITAL, NEW DELHI. Dr Samir is a certified trainer by Bausch and Lomb for Lasik Surgery a renowned surgeon and one of the prestigious member of DOS. In order to impart training in the techniques of Cataract & Lasik surgery, he has been frequently travelling all over the world. He has been conducting paper presentations in national and international conferences and is actively involved in training and research activities in the field of Lasik Surgery.",
            image: "https://healthexpressindia.com/default-doctor.jpg",
            isVerified: true,
            accreditations: ["AIOS", "DOS"],
            email: "samir.sud@sharpsight.in",
            hospitalId: hospitalId,
            surgeries: {
                connect: [{ id: cataractId }, { id: lasikId }]
            }
        }
    });
    console.log("Added Dr. Samir Sud:", samir.id);
}

addDoctors().catch(console.error).finally(() => prisma.$disconnect());
