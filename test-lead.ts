import { prisma } from './src/lib/prisma';

async function main() {
  const surgery = await prisma.surgery.findFirst();
  
  if (!surgery) {
    console.log('No surgeries found in DB.');
    return;
  }

  const newLead = await prisma.lead.create({
    data: {
      fullName: 'John Doe (AI Triage Test)',
      phone: '+919999999999',
      city: 'Delhi',
      surgeryId: surgery.id,
      description: 'AI Triage Lead. Surgery Recommended: LASIK Eye Surgery. Diagnosis: Moderate nearsightedness.',
      sourcePage: 'ai_triage_test',
      status: 'NEW',
      notes: '[ELECTIVE] Follow up for LASIK consultation',
      referenceId: 'HE-TEST-9999',
    }
  });

  console.log('\n--- SUPABASE DATABASE RECORD ---');
  console.log(JSON.stringify(newLead, null, 2));
  console.log('--------------------------------\n');
  
  // Cleanup test lead
  await prisma.lead.delete({ where: { id: newLead.id } });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });