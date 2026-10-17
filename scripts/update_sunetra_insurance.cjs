require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const path = require('path');
const { PrismaClient } = require(path.join(__dirname, '../src/generated/prisma'));
const prisma = new PrismaClient();

const sunetraInsurancePartners = [
  "East West / Volo Health Insurance TPA",
  "Genins India Insurance TPA Ltd",
  "Good Health Insurance TPA Ltd",
  "HDFC ERGO General Health Insurance TPA",
  "Health India Insurance TPA Services Ltd",
  "Health Insurance TPA of India Ltd",
  "Heritage Health Insurance TPA Pvt. Ltd",
  "IFFCO Tokio General Insurance Company Ltd",
  "MDIndia Health Care Insurance TPA Pvt Ltd",
  "Medi Assist TPA",
  "Medsave Health Insurance TPA Ltd",
  "Health Assist TPA Services Pvt Ltd",
  "Vidal Health Insurance TPA",
  "FHPL (Family Health Plan Insurance TPA Ltd)",
  "Park Mediclaim TPA Ltd",
  "IndusInd Insurance / Reliance General Insurance",
  "Niva Bupa Health Insurance Company Limited",
  "Star Health and Allied Insurance Co Ltd",
  "Tata AIG Health Insurance",
  "Paramount Health Services & Insurance TPA Pvt. Ltd",
  "Cholamandalam MS General Insurance",
  "Ericson Insurance TPA Pvt. Ltd",
  "Universal Sompo General Insurance Company",
  "Go Digit General Insurance Limited",
  "ICICI Lombard General Insurance Co. Ltd (Plunes TPA)",
  "Bajaj Allianz General Insurance Company Ltd",
  "Aditya Birla Health Insurance Co. Ltd",
  "Liberty General Insurance Ltd",
  "SBI General Insurance Company Limited",
  "Navi Health Insurance",
  "LINK-K Insurance TPA Private Limited",
  "Future Generali India Insurance Co Ltd",
  "Care Health Insurance TPA",
  "ManipalCigna Health Insurance Company Limited"
];

async function main() {
  // Find Sunetra hospital
  const sunetra = await prisma.hospital.findFirst({
    where: {
      OR: [
        { name: { contains: 'Sunetra', mode: 'insensitive' } },
        { email: 'contact@sunetraeyehospital.com' }
      ]
    }
  });

  if (!sunetra) {
    console.error('Could not find Sunetra hospital in database!');
    process.exit(1);
  }

  console.log(`Found Sunetra: [${sunetra.id}] ${sunetra.name} (${sunetra.city})`);

  // Update hospital record with all 34 insurance partners and updated full hospital name
  const updated = await prisma.hospital.update({
    where: { id: sunetra.id },
    data: {
      name: 'Sunetra Super Speciality Eye Care Centre - Ghaziabad',
      insurancePartners: sunetraInsurancePartners,
      specialties: sunetra.specialties && sunetra.specialties.length > 0 
        ? sunetra.specialties 
        : ['Cataract', 'Lasik', 'Retina', 'Glaucoma', 'Cornea', 'Pediatric Ophthalmology']
    }
  });

  console.log('Successfully updated Sunetra hospital!');
  console.log('Updated Name:', updated.name);
  console.log('Total Insurance/TPA Partners:', updated.insurancePartners.length);
  console.log('Insurance Partners List:');
  updated.insurancePartners.forEach((ins, idx) => console.log(`  ${idx + 1}. ${ins}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
