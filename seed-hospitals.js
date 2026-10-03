const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.hospital.create({
        data: {
            name: 'ASG Eye Hospital',
            city: 'Noida (Dadri)',
            email: 'dadri@asgeyehospital.com',
            status: 'ACTIVE',
            specialties: ['Cataract', 'Lasik', 'Retina'],
            doctors: {
                create: {
                    name: 'Dr. ASG Surgeon',
                    qualification: 'MS Ophthalmology',
                    experience: 10,
                    about: 'Top Surgeon in Noida'
                }
            }
        }
    });

    await prisma.hospital.create({
        data: {
            name: 'Sharp Sight Eye Hospital',
            city: 'Delhi (Preet Vihar)',
            email: 'preetvihar@sharpsight.in',
            status: 'ACTIVE',
            specialties: ['Lasik', 'Glaucoma'],
            doctors: {
                create: {
                    name: 'Dr. Sharp Sight Surgeon',
                    qualification: 'MS Ophthalmology',
                    experience: 12,
                    about: 'Top Surgeon in East Delhi'
                }
            }
        }
    });
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
