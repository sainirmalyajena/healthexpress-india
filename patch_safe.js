const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', 'utf8');

// completely comment out generateMetadata
content = content.replace(/export async function generateMetadata/g, '// export async function generateMetadata');

// wrap page in try catch that returns a div
content = content.replace(/export default async function SurgeryDetailPage\(\{\s*params\s*\}\s*:\s*PageProps\)\s*\{/, 
export default async function SurgeryDetailPage({ params }: PageProps) {
  try {
);

content = content.replace(/return \(\n\s*<div className="min-h-screen bg-slate-50">/,
  } catch(e: any) { return <div style={{padding:"50px", color:"red", fontSize:"20px", background:"white"}}>CATCH_CRASH: {e.message}<br/>{e.stack}</div>; }
  return (
    <div className="min-h-screen bg-slate-50">
);

fs.writeFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', content, 'utf8');
