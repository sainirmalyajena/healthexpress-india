'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
    children: React.ReactNode;
    userName: string;
}

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: '📊' },
    { name: 'Leads', href: '/dashboard/leads', icon: '📋' },
    { name: 'Partner Requests', href: '/dashboard/partners', icon: '🤝' },
    { name: 'Doctors', href: '/dashboard/doctors', icon: '👨‍⚕️' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
];

export default function DashboardShell({ children, userName }: DashboardShellProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
                            <Image
                                src="/logo.png"
                                alt="HealthExpress Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-900 leading-tight">HealthExpress</span>
                            <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Command Center</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-teal-50 text-teal-700 shadow-sm"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <span className={cn(
                                    "text-lg transition-transform duration-200",
                                    isActive ? "scale-110" : "group-hover:scale-110"
                                )}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                        <form action="/api/dashboard/auth" method="DELETE" className="mt-3">
                            <button
                                type="submit"
                                className="w-full text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg transition-colors border border-red-100"
                            >
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
                                <Image
                                    src="/logo.png"
                                    alt="HealthExpress Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-bold text-slate-900 italic">HealthExpress</span>
                        </Link>
                        {/* Mobile menu toggle would go here */}
                    </div>
                </header>

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
