import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { prisma } from './src/lib/prisma';

async function main() {
    console.log('Adding Ghatkopar hospital...');
    
    await prisma.hospital.create({
        data: {
            name: 'Mumbai Eye Care - Ghatkopar East | ASG',
            city: 'Ghatkopar East, Mumbai',
            email: 'ghatkopar@asgeyehospital.com',
            status: 'ACTIVE',
            specialties: ['Cataract', 'Lasik', 'Retina'],
            doctors: {
                create: {
                    name: 'Dr. ASG Ghatkopar',
                    qualification: 'MS Ophthalmology',
                    experience: 10,
                    image: '',
                    email: 'ghatkopar.dr@asgeyehospital.com',
                    about: 'Shop No, 101/102, Jhulelal Chowk, above Eves Saloon, Sindhu Wadi, Ghatkopar East, Mumbai, Maharashtra 400077'
                }
            }
        }
    });
    
    console.log('Done!');
}

main().catch(console.error);
