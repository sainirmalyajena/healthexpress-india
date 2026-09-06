const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', 'utf8');

const target = "export default async function SurgeryDetailPage({ params }: PageProps) {";
const replacement = "export default async function SurgeryDetailPage({ params }: PageProps) {\n  try {";

content = content.replace(target, replacement);

const lastBracketIndex = content.lastIndexOf("}");
content = content.substring(0, lastBracketIndex) + "  } catch (e: any) {\n    return <div style={{padding: '50px', fontSize: '24px', color: 'red'}}>DEBUG ERROR: {e.message}<br/><pre>{e.stack}</pre></div>;\n  }\n}";

fs.writeFileSync('src/app/[lang]/surgeries/[...slug]/page.tsx', content, 'utf8');
