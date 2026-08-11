const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const lead = await prisma.lead.findUnique({
        where: { referenceId: 'HE-MSOFPCEM-V00E' }
    });
    
    if (lead) {
        console.log("LEAD FOUND IN DATABASE!");
        console.log(JSON.stringify(lead, null, 2));
    } else {
        console.log("Lead not found. Wait a few seconds or check the ID.");
    }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
