const fs = require('fs');
const path = 'src/app/[lang]/layout.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('twitter: {\\n      card: "summary_large_image",\\n      title:')) {
  // Try dynamic replace
  content = content.replace(/twitter:\s*{\s*card:\s*"summary_large_image",\s*title:[^}]*?description:[^}]*?,/, match => {
    if (match.includes('images:')) return match;
    return match + '\n      images: [`${baseUrl}/logo.png`],';
  });
}
fs.writeFileSync(path, content, 'utf8');
