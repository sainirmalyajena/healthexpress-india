import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const email = 'dr.sharma@example.com';
    const password = 'password123';
    const hospitalName = 'Apollo Hospital'; // Must exist or we create it

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Ensure Hospital exists
    let hospital = await prisma.hospital.findFirst({
        where: { name: { contains: 'Apollo' } }
    });

    if (!hospital) {
        console.log('Creating hospital for doctor...');
        hospital = await prisma.hospital.create({
            data: {
                name: hospitalName,
                city: 'Bangalore',
                email: 'apollo@example.com',
                specialties: ['Cardiology'],
                discountPercent: 10,
                status: 'ACTIVE'
            }
        });
    }

    // 2. Create/Update Doctor
    const doctorName = 'Dr. Sharma';
    let doctor = await prisma.doctor.findFirst({
        where: { name: doctorName }
    });

    if (doctor) {
        console.log(`Updating existing doctor: ${doctor.name}`);
        doctor = await prisma.doctor.update({
            where: { id: doctor.id },
            data: {
                email,
                passwordHash: hashedPassword,
                status: 'ACTIVE',
                hospitalId: hospital.id
            }
        });
    } else {
        console.log('Creating new test doctor');
        doctor = await prisma.doctor.create({
            data: {
                name: doctorName,
                qualification: 'MBBS, MD',
                experience: 15,
                about: 'Senior Cardiologist with 15 years of experience.',
                image: '/images/doctors/doc1.jpg',
                email,
                passwordHash: hashedPassword,
                status: 'ACTIVE',
                hospitalId: hospital.id,
                surgeries: {
                    connect: [] // Connect existing surgeries if needed
                }
            }
        });
    }

    console.log('================================');
    console.log('Doctor Credentials Generated:');
    console.log(`Doctor: ${doctor.name}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Login at: /doctor/login');
    console.log('================================');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
