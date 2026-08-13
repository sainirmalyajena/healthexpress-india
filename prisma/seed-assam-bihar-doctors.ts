import { PrismaClient } from '../src/generated/prisma';
import { slugify } from '../src/lib/utils';

const prisma = new PrismaClient();

const doctorsData = [
  {
    name: "Dr. Annesha Sarkar",
    qualifications: "DOMS , DNB OPHTHALMOLOGY ( ARAVIND EYE HOSPITAL )",
    specialization: "FELLOWSHIP IN OCULAR PLASTIC AND RECONSTRUCTIVE SURGERY AND OCULAR ONCOLOGY, POST GRADUATE DIPLOMA IN AESTHETICS AND FACIAL COSMETOLOGY",
    experience: 3,
    days: "Mon,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Danish Iqbal",
    qualifications: "MBBS DO (AMU) DNB (PUNE) FICO AND COMPREHENSIVE FELLOWSHIP (SNC)",
    specialization: "CATARACT, GLAUCOMA AND REFRACTIVE",
    experience: 0,
    days: "Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Emee Gogoi",
    qualifications: "MBBS, MS, FELLOWSHIP FROM SANKARA EYE HOSPITAL, KANPUR",
    specialization: "CATARACT, PHACO SURGEON",
    experience: 5,
    days: "Mon,Tue,Wed,Thu,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Gariyashee Lahkar",
    qualifications: "MBBS, MS, FAEH, FAICO (Gold medallist)",
    specialization: "Phaco, Refractive and Anterior Segment",
    experience: 0,
    days: "Mon,Tue,Wed,Thu,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Gitumoni Sharma",
    qualifications: "MBBS, DNB, FSSN, FLCR, FVR (RGUHS)",
    specialization: "VITREO-RETINA & UVEA CONSULTANT",
    experience: 20,
    days: "Mon,Tue,Wed,Thu,Fri,Sat",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Manabjyoti Barman",
    qualifications: "MBBS, DO, DNB, FMRF, FICO",
    specialization: "VITRO- RETINA & OCULAONOCOLOGY",
    experience: 25,
    days: "Mon,Tue,Wed,Thu,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Parmita Dutta",
    qualifications: "MBBS MS ( ASSAM MEDICAL COLLEGE DIBRUGARH) FELLOWSHIP IN CORNEA AND REFRACTIVE SURGERY (SRI SANKARADEVA NETHRALAYA GUWAHATI, ASSAM",
    specialization: "CORNEA, OCULAR SURFACE AND REFRACTIVE SURGEON",
    experience: 4,
    days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Ranjita Borkotoky",
    qualifications: "MBBS, MS (OPHTHALMOLOGY)",
    specialization: "PHACO & CORNEA",
    experience: 10,
    days: "Mon,Tue,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Sagarmoy Purkayastha",
    qualifications: "MBBS, DNB & FSSN (COMPREHENSIVE)",
    specialization: "PHACO & COMPREHENSIVE OPHTHALMOLOGY",
    experience: 20,
    days: "Mon,Tue,Wed,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Sandip Borgohain",
    qualifications: "MBBS, DOMS (AMC), FVR",
    specialization: "PHACO, VITREO-RETINA, UVEA & ROP",
    experience: 13,
    days: "Mon,Wed,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Santana Medhi",
    qualifications: "MBBS, MS, FAEH",
    specialization: "PHACO",
    experience: 7,
    days: "Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "Dr. Satyen Deka",
    qualifications: "MS, DNB & FMRF (SANKARA NETHRALAYA, CHENNAI)",
    specialization: "VITREO-RETINA, UVEA & ROP",
    experience: 29,
    days: "Mon,Tue,Wed,Thu,Fri,Sat",
    time: "9:00 AM - 5:00 PM",
    city: "Guwahati",
    state: "Assam"
  },
  {
    name: "DR. MURTAZA ALI",
    qualifications: "MBBS, MS",
    specialization: "PHACO AND GLAUCOMA",
    experience: 0,
    days: "Mon,Tue,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. (Maj) Naushad Raza Rizvi",
    qualifications: "MBBS, MS & D.H.A (MUMBAI )",
    specialization: "PHACO & GENERAL OPHTHALMOLOGIST",
    experience: 28,
    days: "Mon,Tue,Wed,Thu,Fri,Sat",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Abhinav Kumar",
    qualifications: "MBBS, MS & FVRS (OPHTHALMOLOGY)",
    specialization: "VITREO-RETINA, UVEA, ROP",
    experience: 11,
    days: "Mon,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Aditya Prakash",
    qualifications: "MBBS, MS OPHTHALMOLOGY, FVRS",
    specialization: "VITREORETINA, PHACO, UVEA AND ROP",
    experience: 6,
    days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Amarendra Kumar",
    qualifications: "MBBS, MS (OPHTHALMOLOGY)",
    specialization: "PHACO & GLAUCOMA",
    experience: 16,
    days: "Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Amit Kumar",
    qualifications: "MBBS, DOMS, DNB (SSN, GUWAHATI)",
    specialization: "PHACO, MEDICAL RETINA",
    experience: 6,
    days: "Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Atish Kumar",
    qualifications: "MBBS, MS (OPHTHALMOLOGY), FIOL (SANKARA EYE HOSPITAL, JAIPUR), FAICO (PHACO.)",
    specialization: "ANTERIOR SEGMENT & CATARACT",
    experience: 0,
    days: "Mon,Tue,Wed,Thu,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Bidisha Rani",
    qualifications: "MBBS, MS (Ophthalmology)",
    specialization: "Cornea & Refractive Surgery Specialist",
    experience: 0,
    days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Gauri Singh",
    qualifications: "MBBS, MD (OPHTHALMOLOGY)",
    specialization: "COMPREHENSIVE OPHTHALMOLOGY, CORNEA, GLAUCOMA, RETINA, OCULOPLASTY, AND REFRACTIVE SURGERY",
    experience: 0,
    days: "Mon,Tue,Wed,Thu,Fri,Sat",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Hyder Syed Zulqarnain",
    qualifications: "MBBS, D.O.M.S (Ophthalmology)",
    specialization: "Phaco Cataract Surgery, Medical Retina & Refractive Surgeries",
    experience: 0, // fixed -2
    days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. K L Agarwal",
    qualifications: "MBBS, MS (Ophthalmology)",
    specialization: "Phacoemulsification (cataract surgery), Medical Retina, Glaucoma",
    experience: 19,
    days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Kajal Priya",
    qualifications: "MBBS, DNB OPHTHALMOLOGY, FIGS",
    specialization: "GLAUCOMA, PHACO",
    experience: 7,
    days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Mehnaz Sabah",
    qualifications: "MBBS, MS, FICO (UK), FICS (CATARACT)",
    specialization: "CATARACT AND ANTERIOR SEGMENT",
    experience: 7,
    days: "Mon,Tue,Wed,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Navneet Kumar",
    qualifications: "MD, AIIMS New Delhi",
    specialization: "Phaco, LASIK, and Cornea Surgeon",
    experience: 0,
    days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Neetu S Chaudhary",
    qualifications: "MBBS, MRCPCH (UK), BLS, NALS, APLS Certified",
    specialization: "General Pediatrics, Child Nutrition, Pediatric",
    experience: 18,
    days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Nidhi Prasad",
    qualifications: "MS (Gold Medal), FASGEH",
    specialization: "Cataract, Cornea & Refractive Surgery",
    experience: 0,
    days: "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  },
  {
    name: "Dr. Nishant Kumar",
    qualifications: "MBBS, MS, SR (AIIMS, NEW DELHI) & FAICO (PAEDIATRIC OPHTHALMOLOGY & STRABISBUS)",
    specialization: "PHACO, SQUINT, PEDIATRIC & NEURO OPHTHALMOLOGY",
    experience: 14,
    days: "Mon,Tue,Thu,Fri,Sat,Sun",
    time: "9:00 AM - 5:00 PM",
    city: "Patna",
    state: "Bihar"
  }
];

async function main() {
  console.log('Seeding Assam & Bihar Doctors...');

  for (const doc of doctorsData) {
    const slug = slugify(doc.name);
    const citySlug = slugify(doc.city);
    
    // Auto-generate consistent email & phone
    const email = `${slug}.${citySlug}@healthexpressindia.com`.replace(/-/g, '.');
    const phone = '9307861041'; // fallback phone
    
    // Ensure hospital exists
    const hospital = await prisma.hospital.upsert({
      where: {
        email: `contact@${citySlug}.healthexpress.in`,
      },
      update: {},
      create: {
        name: `ASG Eye Hospital ${doc.city}`,
        city: doc.city,
        email: `contact@${citySlug}.healthexpress.in`,
      }
    });

    const createdDoc = await prisma.doctor.upsert({
      where: { email },
      update: {
        experience: doc.experience,
        qualification: doc.qualifications,
        about: doc.specialization,
        availability: { days: doc.days, time: doc.time },
      },
      create: {
        name: doc.name,
        email: email,
        qualification: doc.qualifications,
        about: doc.specialization,
        experience: doc.experience,
        image: "/images/doctor-placeholder.jpg",
        hospitalId: hospital.id,
        availability: { days: doc.days, time: doc.time },
      }
    });
    
    console.log(`✅ Seeded: ${createdDoc.name} in ${doc.city}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
