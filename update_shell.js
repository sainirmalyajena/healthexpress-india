const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/DashboardShell.tsx', 'utf8');

// Add import
content = content.replace(
    /import Link from 'next\/link';/,
    `import Link from 'next/link';\nimport NotificationBell from './NotificationBell';`
);

// Inject into header near User Info
// Look for `<div className="flex items-center gap-3">`
content = content.replace(
    /<div className="flex items-center gap-3">/,
    `<div className="flex items-center gap-4">\n                    <NotificationBell />`
);

fs.writeFileSync('src/components/dashboard/DashboardShell.tsx', content);
