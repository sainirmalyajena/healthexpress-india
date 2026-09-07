const fs = require('fs');
const content = `import { redirect } from 'next/navigation';

export default async function DashboardRootPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    redirect(\`/\${lang}/dashboard/leads\`);
}
`;
fs.writeFileSync('src/app/[lang]/dashboard/page.tsx', content);
