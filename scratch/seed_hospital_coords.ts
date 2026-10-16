// scratch/seed_hospital_coords.ts
// Seeds pincode + lat/lng for all hospitals in the DB.
// Run: npx ts-node -e "$(cat scratch/seed_hospital_coords.ts)"
// OR:  npx tsx scratch/seed_hospital_coords.ts

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const HOSPITALS: { nameSubstring: string; pincode: string; latitude: number; longitude: number }[] = [
    // ASG Kalyan – Khadakpada, Kalyan West
    { nameSubstring: 'Kalyan',           pincode: '421301', latitude: 19.2388, longitude: 73.1298 },
    // Mumbai Eye Care – Ghatkopar East
    { nameSubstring: 'Ghatkopar',        pincode: '400077', latitude: 19.0719, longitude: 72.9090 },
    // ASG Shivajinagar, Pune
    { nameSubstring: 'Shivajinagar',     pincode: '411005', latitude: 18.5308, longitude: 73.8475 },
    // Bavishi Eye Hospital – Ahmedabad (Sarkhej-Gandhinagar Hwy)
    { nameSubstring: 'Bavishi',          pincode: '380060', latitude: 23.0428, longitude: 72.5052 },
    // Sunetra Eye Hospital – Kavi Nagar, Ghaziabad
    { nameSubstring: 'Sunetra',          pincode: '201002', latitude: 28.6750, longitude: 77.4143 },
    // Acura Vision Clinics – Meerut
    { nameSubstring: 'Acura',            pincode: '250002', latitude: 28.9845, longitude: 77.7064 },
    // ASG Mansa Eye Hospital – Sikar
    { nameSubstring: 'Mansa',            pincode: '332001', latitude: 27.6094, longitude: 75.1399 },
    // Dr. Kamdar Eye Hospital – Jodhpur
    { nameSubstring: 'Kamdar',           pincode: '342001', latitude: 26.2389, longitude: 73.0243 },
    // Kapil Eye Hospital – Ambala
    { nameSubstring: 'Kapil',            pincode: '134003', latitude: 30.3782, longitude: 76.7767 },
];

async function main() {
    for (const h of HOSPITALS) {
        const result = await prisma.hospital.updateMany({
            where: { name: { contains: h.nameSubstring, mode: 'insensitive' } },
            data: { pincode: h.pincode, latitude: h.latitude, longitude: h.longitude },
        });
        console.log(`✅  ${h.nameSubstring.padEnd(20)} → updated ${result.count} row(s)  [${h.pincode}]`);
    }
    console.log('\nDone! All hospital coordinates seeded.');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
