import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { prisma } from './src/lib/prisma';

async function main() {
    console.log('Adding hospitals...');
    
    await prisma.hospital.create({
        data: {
            name: 'ASG Eye Hospital - Kalyan',
            city: 'Kalyan, Maharashtra',
            email: 'kalyan@asgeyehospital.com',
            status: 'ACTIVE',
            specialties: ['Cataract', 'Lasik'],
            doctors: {
                create: {
                    name: 'Dr. ASG Kalyan',
                    qualification: 'MS Ophthalmology',
                    experience: 8,
                    image: '',
                    email: 'kalyan.dr@asgeyehospital.com',
                    about: 'Third Floor, Gandhar Nagar, Khadakpada, nearby Reliance Digital, Bhoirwadi, Kalyan, Maharashtra 421301'
                }
            }
        }
    });

    await prisma.hospital.create({
        data: {
            name: 'ASG Eye Hospital',
            city: 'Noida (Dadri)',
            email: 'dadri@asgeyehospital.com',
            status: 'ACTIVE',
            specialties: ['Cataract', 'Lasik', 'Retina'],
            doctors: {
                create: {
                    name: 'Dr. ASG Noida',
                    qualification: 'MS Ophthalmology',
                    experience: 10,
                    image: '',
                    email: 'dadri.dr@asgeyehospital.com',
                    about: 'Partner Surgeon'
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
                    name: 'Dr. Sharp Sight',
                    qualification: 'MS Ophthalmology',
                    experience: 12,
                    image: '',
                    email: 'preetvihar.dr@sharpsight.in',
                    about: 'Partner Surgeon'
                }
            }
        }
    });
    
    console.log('Done!');
}

main().catch(console.error);
