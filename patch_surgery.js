const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', 'utf8');

// Wrap generateMetadata
content = content.replace(/export async function generateMetadata\(\{ params \}: PageProps\): Promise<Metadata> \{/, `export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {`);
content = content.replace(/return \{\n\s*title: `\$\{surgery\.name\} Cost/, `} catch (e: any) { console.error('Metadata Error:', e); return { title: 'Error: ' + e.message }; }\n  return {\n      title: \`\${surgery.name} Cost`);

// Wrap SurgeryDetailPage
content = content.replace(/export default async function SurgeryDetailPage\(\{ params \}: PageProps\) \{/, `export default async function SurgeryDetailPage({ params }: PageProps) {
  try {`);
content = content.replace(/return \(\n\s*<div className="min-h-screen bg-slate-50">/, `} catch (e: any) { return <div className="p-10 text-red-600 font-bold bg-white text-2xl">PAGE CRASHED: {e.message} <br/><br/> {e.stack}</div>; }\n  return (\n      <div className="min-h-screen bg-slate-50">`);

fs.writeFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', content, 'utf8');
