import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting SEO injection for Ankle Surgery...');

    // 1. Find the ankle surgery
    const surgery = await prisma.surgery.findFirst({
        where: {
            slug: {
                contains: 'ankle',
            }
        }
    });

    if (!surgery) {
        console.error('Ankle surgery not found in DB!');
        return;
    }

    console.log(`Found surgery: ${surgery.name} (ID: ${surgery.id})`);

    // 2. SEO Content Injection
    const seoOverview = `
### Ankle Surgery Cost in India (2026 Guide)
If you are suffering from chronic ankle pain, arthritis, or have sustained a severe fracture, ankle surgery might be necessary to restore mobility. But how much does it cost? 

The **ankle surgery cost in India** is significantly lower than in Western countries, making it a hub for medical tourism. On average, the cost ranges from **₹80,000 to ₹2,50,000** depending on whether you need arthroscopy, fusion, or a complete ankle replacement.

#### Ankle Surgery Cost in Delhi
Patients frequently travel for treatment because the **ankle surgery cost in Delhi** is highly competitive while offering world-class infrastructure. Top hospitals in Delhi NCR offer advanced robotic ankle surgeries starting at just ₹1,20,000. 

At HealthExpress India, we provide free consultations and transparent quotes with no hidden charges. Contact us via WhatsApp to get an exact estimate from the best orthopedic surgeons in your city.
    `;

    // Append to existing overview or overwrite if small
    const newOverview = surgery.overview + "\n\n" + seoOverview;

    await prisma.surgery.update({
        where: { id: surgery.id },
        data: {
            overview: newOverview,
            metaTitle: "Ankle Surgery Cost in India & Delhi | Free Quote",
            metaDesc: "Find the exact ankle surgery cost in India and Delhi. Get a free quote and connect with top orthopedic surgeons for ankle repair and replacement.",
        }
    });

    console.log('Successfully injected SEO content for Ankle Surgery!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
