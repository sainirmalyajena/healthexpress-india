import { config } from 'dotenv';
config({ path: '.env.local' });
import { prisma } from './src/lib/prisma';

async function main() {
    const hospitals = await prisma.hospital.findMany({ select: { name: true } });
    console.log(JSON.stringify(hospitals, null, 2));
}

main().catch(console.error);
