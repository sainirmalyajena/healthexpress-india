const fs = require('fs');

let content = fs.readFileSync('src/app/[lang]/dashboard/page.tsx', 'utf8');

// Padding and spacing
content = content.replace(
    /className="p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-full"/,
    `className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 bg-slate-50 min-h-full"`
);

// Header font
content = content.replace(
    /className="text-3xl font-black text-slate-900 tracking-tight"/,
    `className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight"`
);

// KPI fonts
content = content.replace(
    /className="text-5xl font-black mb-1"/g,
    `className="text-4xl md:text-5xl font-black mb-1"`
);

fs.writeFileSync('src/app/[lang]/dashboard/page.tsx', content);
