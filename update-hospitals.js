const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
    const data = [
        {
            hospital: "Eye Veda Hospital",
            address: "GF, E5, Block E, Defence Colony, New Delhi, Delhi 110024",
            city: "New Delhi",
            googleMapsUrl: "https://share.google/fYjY0CjiFTVE2YwoM"
        },
        {
            hospital: "Bharti Eye Hospital",
            address: "E-52, Block E, Greater Kailash I, Greater Kailash, New Delhi, Delhi 110048",
            city: "New Delhi",
            googleMapsUrl: "https://maps.app.goo.gl/QcGv6zUB4ZtHRK367"
        },
        {
            hospital: "The Sight Avenue Eye Hospital (Greater Kailash)",
            address: "E-82-A, Ground Floor, Hansraj Gupta Rd, Greater Kailash I, New Delhi, Delhi 110048",
            city: "New Delhi",
            googleMapsUrl: "https://maps.app.goo.gl/FTKQ5c8Yk29VuKux9"
        },
        {
            hospital: "The Sight Avenue Eye Hospital (Gurugram)",
            address: "243 P, Sector 38, near Bakhtawar Chowk, Gurugram, Haryana 122018",
            city: "Gurugram",
            googleMapsUrl: "https://maps.app.goo.gl/vbWFqnKL8R5XyQfU7"
        },
        {
            hospital: "Synergy eye care",
            address: "A-6, Block A, chittaranjan park, New Delhi, Delhi 110048",
            city: "New Delhi",
            googleMapsUrl: "https://maps.app.goo.gl/NcP5tnihCPmmHSvf6?g_st=awb"
        }
    ];

    for (const item of data) {
        const dummyEmailH = `info@${item.hospital.replace(/[^a-zA-Z]/g, '').toLowerCase()}.com`;
        
        await prisma.hospital.update({
            where: { email: dummyEmailH },
            data: {
                address: item.address,
                googleMapsUrl: item.googleMapsUrl
            }
        });
        
        console.log(`Updated Hospital: ${item.hospital}`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
