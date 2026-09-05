const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', 'utf8');

content = content.replace(
  'export default async function SurgeryDetailPage({ params }: PageProps) {',
  'export default async function SurgeryDetailPage({ params }: PageProps) {\n  try {'
);

content = content.replace(
  '<div className="min-h-screen bg-slate-50">',
  '</div>; } catch(e: any) { return <div style={{padding:"50px", color:"red", fontSize:"20px", background:"white"}}>CRASH: {e.message}<br/>{e.stack}</div>; }\n  return (\n    <div className="min-h-screen bg-slate-50">'
);
// The above will break if I replace it like that because it replaces the FIRST occurrence.
