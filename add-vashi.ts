import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { prisma } from './src/lib/prisma';

async function main() {
    console.log('Adding Vashi hospital...');
    
    await prisma.hospital.create({
        data: {
            name: 'ASG Eye Hospital - Vashi',
            city: 'Vashi, Mumbai',
            email: 'vashi@asgeyehospital.com',
            status: 'ACTIVE',
            specialties: ['Cataract', 'Lasik', 'Retina'],
            doctors: {
                create: {
                    name: 'Dr. ASG Vashi',
                    qualification: 'MS Ophthalmology',
                    experience: 10,
                    image: '',
                    email: 'vashi.dr@asgeyehospital.com',
                    about: 'Sixth Floor, Goodwill Excellency, Plot No. 88, Near Tanishq Jewellers, Vashi, Mumbai, Maharashtra - 400703'
                }
            }
        }
    });
    
    console.log('Done!');
}

main().catch(console.error);
