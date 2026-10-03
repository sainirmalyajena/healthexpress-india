const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    const data = [
        {
            hospital: "Eye Veda Hospital",
            address: "GF, E5, Block E, Defence Colony, New Delhi, Delhi 110024",
            city: "New Delhi",
            googleMapsUrl: "https://share.google/fYjY0CjiFTVE2YwoM",
            doctor: "Dr. Surabhi"
        },
        {
            hospital: "Bharti Eye Hospital",
            address: "E-52, Block E, Greater Kailash I, Greater Kailash, New Delhi, Delhi 110048",
            city: "New Delhi",
            googleMapsUrl: "https://maps.app.goo.gl/QcGv6zUB4ZtHRK367",
            doctor: "Dr. Bhupesh Singh"
        },
        {
            hospital: "The Sight Avenue Eye Hospital (Greater Kailash)",
            address: "E-82-A, Ground Floor, Hansraj Gupta Rd, Greater Kailash I, New Delhi, Delhi 110048",
            city: "New Delhi",
            googleMapsUrl: "https://maps.app.goo.gl/FTKQ5c8Yk29VuKux9",
            doctor: "Dr. Suraj Munjal"
        },
        {
            hospital: "The Sight Avenue Eye Hospital (Gurugram)",
            address: "243 P, Sector 38, near Bakhtawar Chowk, Gurugram, Haryana 122018",
            city: "Gurugram",
            googleMapsUrl: "https://maps.app.goo.gl/vbWFqnKL8R5XyQfU7",
            doctor: "Dr. Suraj Munjal"
        },
        {
            hospital: "Synergy eye care",
            address: "A-6, Block A, chittaranjan park, New Delhi, Delhi 110048",
            city: "New Delhi",
            googleMapsUrl: "https://maps.app.goo.gl/NcP5tnihCPmmHSvf6?g_st=awb",
            doctor: "Dr. Vinay Garodia"
        }
    ];

    for (const item of data) {
        // Create Hospital
        const dummyEmailH = `info@${item.hospital.replace(/[^a-zA-Z]/g, '').toLowerCase()}.com`;
        
        // Upsert hospital just in case
        const hospital = await prisma.hospital.upsert({
            where: { email: dummyEmailH },
            update: { city: item.city },
            create: {
                name: item.hospital,
                email: dummyEmailH,
                city: item.city,
                specialties: ["Cataract", "LASIK", "General Ophthalmology"],
                discountPercent: 0,
                status: "ACTIVE"
            }
        });
        
        console.log(`Hospital ready: ${hospital.name}`);

        // Create Doctor
        const dummyEmailD = `dr.${item.doctor.replace(/[^a-zA-Z]/g, '').toLowerCase()}@${item.hospital.replace(/[^a-zA-Z]/g, '').toLowerCase()}.com`;
        const aboutText = `Consulting Surgeon at ${item.hospital}.\nAddress: ${item.address}\nGoogle Maps: ${item.googleMapsUrl}`;

        const doctor = await prisma.doctor.upsert({
            where: { email: dummyEmailD },
            update: { about: aboutText },
            create: {
                name: item.doctor,
                email: dummyEmailD,
                hospitalId: hospital.id,
                qualification: "MBBS, MS - Ophthalmology",
                experience: 15,
                about: aboutText,
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop",
                isVerified: true,
                accreditations: ["NABH"],
                status: "ACTIVE"
            }
        });

        console.log(`Doctor ready: ${doctor.name} at ${hospital.name}`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
