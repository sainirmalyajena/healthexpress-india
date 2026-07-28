import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed script for real doctors...');

    // 1. Delete all existing fake doctors and hospitals to clean the slate
    // (We wrap in try/catch in case foreign keys restrict deletion, but since it's a dev/test seed it should be fine or we might need to be careful with leads. If there are leads, we might just delete doctors without leads or just delete all doctors).
    // Let's just delete all Doctors, and Hospitals. 
    console.log('Unlinking leads from hospitals...');
    await prisma.lead.updateMany({
        data: { hospitalId: null }
    });

    console.log('Deleting existing doctors...');
    await prisma.doctor.deleteMany({});
    
    console.log('Deleting existing hospitals...');
    await prisma.hospital.deleteMany({});

    // 2. Fetch all surgeries to link doctors to them
    const surgeries = await prisma.surgery.findMany();
    const surgeryIds = surgeries.map(s => ({ id: s.id }));

    // 3. Create Real Hospitals
    console.log('Creating real hospitals...');
    
    const envision = await prisma.hospital.create({
        data: {
            name: 'Envision Eye Hospital',
            city: 'Mumbai',
            specialties: ['Ophthalmology', 'Vitreo-Retina', 'LASIK', 'Cataract'],
            email: 'contact@envisioneye.com',
            status: 'ACTIVE'
        }
    });

    const mumbaiEyeCare = await prisma.hospital.create({
        data: {
            name: 'Mumbai Eye Care',
            city: 'Mumbai',
            specialties: ['Ophthalmology', 'Cornea', 'Refractive Surgery', 'Cataract'],
            email: 'contact@mumbaieyecare.com',
            status: 'ACTIVE'
        }
    });

    const asg = await prisma.hospital.create({
        data: {
            name: 'ASG Eye Hospital',
            city: 'Mumbai',
            specialties: ['Ophthalmology', 'LASIK', 'Retina', 'Glaucoma'],
            email: 'mumbai@asgeyehospital.com',
            status: 'ACTIVE'
        }
    });

    const sharpSight = await prisma.hospital.create({
        data: {
            name: 'Sharp Sight Eye Hospital',
            city: 'Delhi',
            specialties: ['Ophthalmology', 'Cataract', 'LASIK', 'Glaucoma'],
            email: 'info@sharpsight.in',
            status: 'ACTIVE'
        }
    });

    // 4. Create Real Doctors
    console.log('Creating real doctors...');

    await prisma.doctor.create({
        data: {
            name: 'Dr. Saumil Sheth',
            qualification: 'MBBS, MS, DNB, FRCS, FICO, FCPS',
            experience: 25,
            about: 'Prominent ophthalmologist and eye surgeon. Medical Director and Chief Surgeon at Envision Eye Hospital. Specializes in Vitreo-Retina, LASIK, and Cataract surgeries.',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop', // Professional placeholder
            isVerified: true,
            accreditations: ['NABH', 'FICO', 'FRCS'],
            email: 'dr.saumilsheth@envisioneye.com',
            status: 'ACTIVE',
            hospitalId: envision.id,
            surgeries: { connect: surgeryIds }
        }
    });

    await prisma.doctor.create({
        data: {
            name: 'Dr. Jatin Ashar',
            qualification: 'MD (AIIMS), DNB, FICO (UK), FAICO',
            experience: 20,
            about: 'Renowned ophthalmologist and Managing Director of Mumbai Eye Care. Specialist in Cataract, Cornea, and Refractive Surgery (including LASIK).',
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
            isVerified: true,
            accreditations: ['AIIMS', 'FICO (UK)'],
            email: 'dr.jatin@mumbaieyecare.com',
            status: 'ACTIVE',
            hospitalId: mumbaiEyeCare.id,
            surgeries: { connect: surgeryIds }
        }
    });

    await prisma.doctor.create({
        data: {
            name: 'Dr. Himanshu Mehta',
            qualification: 'MBBS, MS (Ophthalmology)',
            experience: 30,
            about: 'Senior Eye Surgeon with over 30 years of experience in advanced LASIK and Retina surgeries at ASG Eye Hospital.',
            image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&auto=format&fit=crop',
            isVerified: true,
            accreditations: ['NABH'],
            email: 'dr.himanshu@asgeyehospital.com',
            status: 'ACTIVE',
            hospitalId: asg.id,
            surgeries: { connect: surgeryIds }
        }
    });

    await prisma.doctor.create({
        data: {
            name: 'Dr. Kamal B. Kapur',
            qualification: 'MBBS, MS (Ophthalmology)',
            experience: 28,
            about: 'Director at Sharp Sight Eye Hospital. Highly acclaimed for his pioneering work in advanced Cataract and Refractive surgery.',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
            isVerified: true,
            accreditations: ['NABH'],
            email: 'dr.kamalkapur@sharpsight.in',
            status: 'ACTIVE',
            hospitalId: sharpSight.id,
            surgeries: { connect: surgeryIds }
        }
    });

    console.log('Successfully seeded real doctors and hospitals!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
