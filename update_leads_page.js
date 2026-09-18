const fs = require('fs');

let content = fs.readFileSync('src/app/[lang]/dashboard/leads/page.tsx', 'utf8');

// Import AddLeadModal
content = content.replace(
    /import \{ CSVUploader \} from '@\/components\/dashboard\/CSVUploader';/,
    `import { CSVUploader } from '@/components/dashboard/CSVUploader';\nimport AddLeadModal from '@/components/dashboard/AddLeadModal';`
);

// Fetch surgeries
content = content.replace(
    /const teamMembers = await prisma.user.findMany\(\{[\s\S]*?\}\);/,
    `const teamMembers = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' }
    });
    
    const surgeries = await prisma.surgery.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    });`
);

// Add button to header
content = content.replace(
    /\{session\.role !== 'team' && <CSVUploader teamMembers=\{teamMembers\} \/>\}/,
    `<div className="flex gap-3">
                            <AddLeadModal surgeries={surgeries} />
                            {session.role !== 'team' && <CSVUploader teamMembers={teamMembers} />}
                        </div>`
);

fs.writeFileSync('src/app/[lang]/dashboard/leads/page.tsx', content);
