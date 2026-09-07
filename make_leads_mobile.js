const fs = require('fs');

let content = fs.readFileSync('src/app/[lang]/dashboard/leads/page.tsx', 'utf8');

content = content.replace(
    /className="p-8"/g,
    `className="p-4 md:p-8"`
);

content = content.replace(
    /className="text-3xl font-black text-slate-800 mb-2"/,
    `className="text-2xl md:text-3xl font-black text-slate-800 mb-2"`
);

fs.writeFileSync('src/app/[lang]/dashboard/leads/page.tsx', content);
