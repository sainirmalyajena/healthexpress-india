import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Starting doctor update...");

        // 1. Get or Create Hospital
        let hospital = await prisma.hospital.findFirst({
            where: { name: { contains: "Envision Eye", mode: 'insensitive' } }
        });

        if (!hospital) {
            console.log("Creating Envision Eye Hospital...");
            hospital = await prisma.hospital.create({
                data: {
                    name: "Envision Eye Hospital",
                    city: "Mumbai",
                    email: "contact@envisioneyehospital.in",
                    specialties: ["OPHTHALMOLOGY"],
                }
            });
        }

        console.log("Hospital ID:", hospital.id);

        // 2. Get LASIK Surgery
        const lasik = await prisma.surgery.findUnique({
            where: { slug: "lasik-eye-surgery" }
        });

        if (!lasik) {
            throw new Error("LASIK surgery not found in DB!");
        }

        console.log("LASIK Surgery ID:", lasik.id);

        // 3. Get or Create Doctor
        let doctor = await prisma.doctor.findFirst({
            where: { name: { contains: "Saumil Sheth", mode: 'insensitive' } },
            include: { surgeries: true }
        });

        if (!doctor) {
            console.log("Creating Dr. Saumil Sheth...");
            doctor = await prisma.doctor.create({
                data: {
                    name: "Saumil Sheth",
                    qualification: "MBBS, MS (Ophthalmology), DNB, FICO (UK), FRCS (Glasgow)",
                    experience: 20,
                    about: "Dr. Saumil Sheth is a highly experienced Eye Specialist and Surgeon specializing in LASIK, Cataract, and Refractive Surgery. He has trained globally and is recognized as a top expert in premium eye care.",
                    image: "https://envisioneyehospital.in/wp-content/uploads/2022/10/saumil.png",
                    isVerified: true,
                    accreditations: ["FICO (UK)", "FRCS (Glasgow)"],
                    email: "saumil.sheth@envisioneyehospital.in",
                    hospitalId: hospital.id,
                    surgeries: {
                        connect: [{ id: lasik.id }]
                    }
                },
                include: { surgeries: true }
            });
        } else {
            console.log("Updating existing Dr. Saumil Sheth...");
            
            const isLinked = doctor.surgeries.some(s => s.id === lasik.id);
            if (!isLinked) {
                doctor = await prisma.doctor.update({
                    where: { id: doctor.id },
                    data: {
                        surgeries: {
                            connect: [{ id: lasik.id }]
                        }
                    },
                    include: { surgeries: true }
                });
            }
        }

        console.log("Successfully updated Dr. Saumil Sheth!");
        console.log("Doctor:", doctor.name, "| Hospital:", hospital.name, "| Linked Surgeries:", doctor.surgeries.map(s => s.name).join(", "));
        
    } catch (error) {
        console.error("Error updating doctor:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
