const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/DashboardShell.tsx', 'utf8');

const imports = `import { Menu, X, LayoutDashboard, Users, BarChart, Handshake, Stethoscope, Settings as SettingsIcon } from 'lucide-react';`;
content = content.replace(/import \{ Menu, X \} from 'lucide-react';/, imports);

const newNav = `    const navItems = userRole === 'team' ? [
        { name: 'My Leads (CRM)', href: '/dashboard/leads', icon: <Users className="w-5 h-5" /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <SettingsIcon className="w-5 h-5" /> },
    ] : [
        { name: 'Leads', href: '/dashboard/leads', icon: <Users className="w-5 h-5" /> },
        { name: 'Team Analytics', href: '/dashboard/analytics', icon: <BarChart className="w-5 h-5" /> },
        { name: 'Partner Requests', href: '/dashboard/partners', icon: <Handshake className="w-5 h-5" /> },
        { name: 'Doctors', href: '/dashboard/doctors', icon: <Stethoscope className="w-5 h-5" /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <SettingsIcon className="w-5 h-5" /> },
    ];`;

content = content.replace(/const navItems = userRole === 'team' \? \[[\s\S]*?\];/m, newNav);

fs.writeFileSync('src/components/dashboard/DashboardShell.tsx', content);
