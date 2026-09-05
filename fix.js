const fs = require('fs');

let shell = fs.readFileSync('src/components/dashboard/DashboardShell.tsx', 'utf8');
shell = shell.replace(/const navItems[\s\S]*?\];/m, \const navItems = userRole === 'team' ? [
        { name: 'My Leads (CRM)', href: '/dashboard/leads', icon: '??' },
        { name: 'Settings', href: '/dashboard/settings', icon: '??' },
    ] : [
        { name: 'Overview', href: '/dashboard', icon: '??' },
        { name: 'Leads', href: '/dashboard/leads', icon: '??' },
        { name: 'Team Analytics', href: '/dashboard/analytics', icon: '??' },
        { name: 'Partner Requests', href: '/dashboard/partners', icon: '??' },
        { name: 'Doctors', href: '/dashboard/doctors', icon: '?????' },
        { name: 'Settings', href: '/dashboard/settings', icon: '??' },
    ];\);
fs.writeFileSync('src/components/dashboard/DashboardShell.tsx', shell, 'utf8');

let table = fs.readFileSync('src/components/dashboard/LeadsTable.tsx', 'utf8');
table = table.replace(/dY\"z/g, '??');
fs.writeFileSync('src/components/dashboard/LeadsTable.tsx', table, 'utf8');

let callModal = fs.readFileSync('src/components/dashboard/LogCallModal.tsx', 'utf8');
callModal = callModal.replace(/const CALL_OUTCOMES[\s\S]*?\];/m, \const CALL_OUTCOMES = [
    { value: 'Connected', emoji: '?' },
    { value: 'No Answer', emoji: '??' },
    { value: 'Left Voicemail', emoji: '??' },
    { value: 'Wrong Number', emoji: '?' },
    { value: 'Call Back Later', emoji: '??' },
];\);
fs.writeFileSync('src/components/dashboard/LogCallModal.tsx', callModal, 'utf8');

let progress = fs.readFileSync('src/components/dashboard/DailyProgressBar.tsx', 'utf8');
progress = progress.replace(/isComplete \? '.*? ' : '.*? '/, \"isComplete ? '?? ' : '?? '\");
fs.writeFileSync('src/components/dashboard/DailyProgressBar.tsx', progress, 'utf8');

let analytics = fs.readFileSync('src/components/dashboard/TeamAnalytics.tsx', 'utf8');
analytics = analytics.replace(/case 'STATUS_CHANGED': return '.*?';/, \"case 'STATUS_CHANGED': return '??';\");
analytics = analytics.replace(/case 'CALL_LOGGED': return '.*?';/, \"case 'CALL_LOGGED': return '??';\");
analytics = analytics.replace(/case 'NOTE_ADDED': return '.*?';/, \"case 'NOTE_ADDED': return '??';\");
analytics = analytics.replace(/case 'LEAD_ASSIGNED': return '.*?';/, \"case 'LEAD_ASSIGNED': return '??';\");
analytics = analytics.replace(/case 'LOGIN': return '.*?';/, \"case 'LOGIN': return '??';\");
analytics = analytics.replace(/default: return '.*?';/, \"default: return '??';\");
analytics = analytics.replace(/>?? Team Overview</, \">?? Team Overview<\");
analytics = analytics.replace(/>?? Live Activity Feed</, \">?? Live Activity Feed<\");
fs.writeFileSync('src/components/dashboard/TeamAnalytics.tsx', analytics, 'utf8');
