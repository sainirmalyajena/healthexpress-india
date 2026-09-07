const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/dashboard/page.tsx', 'utf8');

content = content.replace(
    /let teamPerformance = \[\];/,
    `let teamPerformance: { name: string; todaysBookings: number; totalActive: number; initials: string; }[] = [];`
);

fs.writeFileSync('src/app/[lang]/dashboard/page.tsx', content);
