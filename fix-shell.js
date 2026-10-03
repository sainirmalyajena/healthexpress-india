const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'DashboardShell.tsx');
let content = fs.readFileSync(file, 'utf8');

const oldNav = `const navItems = userRole === 'team' ? [
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Leads', href: '/dashboard/leads', icon: <Users className="w-5 h-5" /> },
        { name: 'Team Analytics', href: '/dashboard/analytics', icon: <BarChart className="w-5 h-5" /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <SettingsIcon className="w-5 h-5" /> },
    ] :`;

const newNav = `const navItems = userRole === 'team' ? [
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Leads', href: '/dashboard/leads', icon: <Users className="w-5 h-5" /> },
        { name: 'Team Analytics', href: '/dashboard/analytics', icon: <BarChart className="w-5 h-5" /> },
        { name: 'Hospitals', href: '/dashboard/hospitals', icon: <Handshake className="w-5 h-5" /> },
        { name: 'Doctors', href: '/dashboard/doctors', icon: <Stethoscope className="w-5 h-5" /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <SettingsIcon className="w-5 h-5" /> },
    ] :`;

content = content.replace(oldNav, newNav);
fs.writeFileSync(file, content, 'utf8');
