const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function addDoctors() {
  const eyeSurgeries = await prisma.surgery.findMany({
    where: { category: 'OPHTHALMOLOGY' }
  });
  
  const surgeryIds = eyeSurgeries.map(s => ({ id: s.id }));

  const newDoctors = [
    {
      name: "Dr. Hemant Chasia",
      qualification: "MBBS, MS (Ophthalmology), DOMS",
      experience: 30,
      about: "Dr. Hemant Chasia is a highly experienced ophthalmologist and the founder of Drishti Eye Hospital in Virar West, Mumbai. With over 30 years of experience, he specializes in comprehensive eye care, including phaco cataract surgery, refractive LASIK procedures, and the management of various eye conditions such as glaucoma and diabetic retinopathy. His practice is now associated with the ASG Eye Hospital network.",
      hospital: {
        name: "ASG Drishti Eye Hospital",
        city: "Mumbai",






      }
    },
    {
      name: "Dr. Nitin Dua",
      qualification: "MBBS, MS, DNB, FRCS (U.K.)",
      experience: 25,
      about: "Dr. Nitin Dua is a well-known ophthalmologist in Ghaziabad, prominently associated with Sunetra Eye Care Centre. He is a former fellow of the L.V. Prasad Eye Institute. His areas of expertise include Femto-LASIK, Sutureless Cataract Eye Surgery, Cornea Services and Transplantation, ICL, and Keratoconus management (C3R).",
      hospital: {
        name: "Sunetra Eye Hospital",
        city: "Ghaziabad",






      }
    },
    {
      name: "Dr. Roop",
      qualification: "MBBS, MD (Ophthalmology) - AIIMS",
      experience: 39,
      about: "Dr. Roop is a highly experienced ophthalmologist based in Meerut and the Founder and Chairman of Acura Vision (Roop Netralaya). An alumnus of AIIMS, New Delhi, he has over 39 years of clinical experience. He specializes in Cataract Surgery (including Phacoemulsification and Femto Laser), Refractive Surgery, Glaucoma Treatment, and Retina Care.",
      hospital: {
        name: "Roop Eye Netralaya (Acura Vision)",
        city: "Meerut",






      }
    },
    {
      name: "Dr. Uday Gadgil",
      qualification: "Consultant Ophthalmic Surgeon",
      experience: 30,
      about: "Dr. Uday Gadgil is a highly experienced Consultant Ophthalmic Surgeon and the Medical Director of Dr. Gadgil Eye Hospital & Lasik Laser Centre in Thane. He has over 30 years of experience in the field and is well-regarded for his work in cataract and LASIK surgeries. His hospital provides comprehensive eye care services equipped with advanced diagnostic and surgical technology.",
      hospital: {
        name: "Gadgil Eye Hospital",
        city: "Thane",






      }
    },
    {
      name: "Dr. Vinay Kumar Garg",
      qualification: "MBBS, MS (Ophthalmology)",
      experience: 25,
      about: "Dr. Vinay Kumar Garg is a senior ophthalmologist and eye surgeon associated with ASG Garg Ophthalmic Centre in Nirala Nagar, Lucknow. He offers comprehensive eye care services, including blade-free cataract surgery, glaucoma care, retina care, LASIK, refractive surgery, and pediatric ophthalmology. The centre is CGHS-empanelled and NABH-accredited.",
      hospital: {
        name: "ASG Garg Ophthalmic Centre",
        city: "Lucknow",






      }
    },
    {
      name: "Dr. Ashish Kumar Agarwal",
      qualification: "MBBS, MD (AIIMS)",
      experience: 19,
      about: "Dr. Ashish Agarwal is a prominent ophthalmologist associated with ASG Eye Hospital in Jaipur. He holds an MBBS and an MD from AIIMS, New Delhi, and has 19 years of experience in the field of ophthalmology. He is a specialist in Cataract, Glaucoma, and Contoura LASIK surgeries.",
      hospital: {
        name: "ASG Eye Hospital - C Scheme",
        city: "Jaipur",






      }
    }
  ];

  for (const docData of newDoctors) {
    console.log(`Adding ${docData.name}...`);
    const doc = await prisma.doctor.create({
      data: {
        name: docData.name,
        qualification: docData.qualification,
        experience: docData.experience,
        about: docData.about,
        image: "https://healthexpressindia.com/default-doctor.jpg",
        email: `${docData.name.replace(/[^a-zA-Z]/g, '').toLowerCase()}@healthexpressindia.com`,
        isVerified: true,
        status: 'ACTIVE',
        surgeries: {
          connect: surgeryIds
        },
        hospital: {
          create: {
            ...docData.hospital,
            email: `contact@${docData.hospital.name.replace(/[^a-zA-Z]/g, '').toLowerCase()}.com`
          }
        }
      }
    });
    console.log(`Successfully added ${doc.name} with ID: ${doc.id}`);
  }
}

addDoctors()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
