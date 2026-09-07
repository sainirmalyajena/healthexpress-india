const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/TeamAnalytics.tsx', 'utf8');

const timeAgoFunc = `
const getTimeAgo = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return \`\${minutes}m ago\`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return \`\${hours}h ago\`;
    return \`\${Math.floor(hours / 24)}d ago\`;
};
`;

content = content.replace(
    /export default function TeamAnalytics/g,
    timeAgoFunc + '\nexport default function TeamAnalytics'
);

content = content.replace(
    /\{online \? 'Online' : 'Offline'\}/g,
    `{online ? 'Online' : \`Offline (\${getTimeAgo(member.lastActiveAt)})\`}`
);

// Fix question marks
content = content.replace(/\?\? Team Overview/g, '?? Team Overview');
content = content.replace(/\?\? Live Activity Feed/g, '? Live Activity Feed');

fs.writeFileSync('src/components/dashboard/TeamAnalytics.tsx', content);
