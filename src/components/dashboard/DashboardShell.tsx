'use client';

import Link from 'next/link';
import NotificationBell from './NotificationBell';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, Users, BarChart, Handshake, Stethoscope, Settings as SettingsIcon, ClipboardList } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Heartbeat from './Heartbeat';

interface DashboardShellProps {
    children: React.ReactNode;
    userName: string;
    userRole?: string;
}

export default function DashboardShell({ children, userName, userRole }: DashboardShellProps) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on route change or when pressing Escape key
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsSidebarOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const navItems = userRole === 'team' ? [
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Leads', href: '/dashboard/leads', icon: <Users className="w-5 h-5" /> },
        { name: 'Team Analytics', href: '/dashboard/analytics', icon: <BarChart className="w-5 h-5" /> },
        { name: 'Hospitals', href: '/dashboard/hospitals', icon: <Handshake className="w-5 h-5" /> },
        { name: 'Doctors', href: '/dashboard/doctors', icon: <Stethoscope className="w-5 h-5" /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <SettingsIcon className="w-5 h-5" /> },
    ] : [
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Leads', href: '/dashboard/leads', icon: <Users className="w-5 h-5" /> },
        { name: 'Team Analytics', href: '/dashboard/analytics', icon: <BarChart className="w-5 h-5" /> },
        { name: 'Hospitals', href: '/dashboard/hospitals', icon: <Handshake className="w-5 h-5" /> },
        { name: 'Doctors', href: '/dashboard/doctors', icon: <Stethoscope className="w-5 h-5" /> },
        { name: 'Audit Logs', href: '/dashboard/activity', icon: <ClipboardList className="w-5 h-5" /> },
        { name: 'Settings', href: '/dashboard/settings', icon: <SettingsIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Backdrop Overlay when Sidebar is open */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Slide-over Collapsible Sidebar Drawer */}
            <aside className={cn(
                "w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Sidebar Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setIsSidebarOpen(false)}>
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
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Close Menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Phone Search */}
                <div className="px-4 py-3 border-b border-slate-100">
                    <form action="/dashboard/leads" method="GET" className="relative">
                        <input 
                            type="text" 
                            name="query" 
                            placeholder="Find lead by phone..." 
                            className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-lg text-xs focus:ring-2 focus:ring-teal-500 transition-all focus:bg-white"
                        />
                        <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </form>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-teal-50 text-teal-700 shadow-xs font-semibold"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <span className={cn(
                                    "text-lg transition-transform duration-200",
                                    isActive ? "scale-110 text-teal-600" : "text-slate-400 group-hover:scale-110 group-hover:text-slate-600"
                                )}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer User Info */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs">
                        <p className="text-[11px] text-slate-400 font-medium">Logged in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{userName}</p>
                        <button
                            onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
                            className="w-full mt-3 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 py-1.5 rounded-lg transition-colors border border-red-100"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Top Navigation Bar with Toggle Button */}
            <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 sticky top-0 z-30 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3 sm:gap-4">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="px-3 py-1.5 text-slate-700 hover:text-teal-700 hover:bg-teal-50 bg-slate-50 rounded-xl border border-slate-200 transition-all flex items-center gap-2 group shadow-2xs cursor-pointer"
                        title="Open Menu"
                    >
                        <Menu className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-600 group-hover:text-teal-600" />
                        <span className="text-xs font-bold text-slate-700 group-hover:text-teal-700">Menu</span>
                    </button>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="relative w-7 h-7">
                            <Image
                                src="/logo.png"
                                alt="HealthExpress Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm leading-tight">HealthExpress</span>
                            <span className="text-[9px] text-teal-600 font-bold uppercase tracking-wider hidden sm:inline">Command Center</span>
                        </div>
                    </Link>
                </div>

                {/* Center Quick Search on wider screens */}
                <div className="hidden md:block w-72 lg:w-96">
                    <form action="/dashboard/leads" method="GET" className="relative">
                        <input 
                            type="text" 
                            name="query" 
                            placeholder="Find lead by phone number..." 
                            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-transparent rounded-lg text-xs focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                        />
                        <svg className="w-3.5 h-3.5 absolute left-3 top-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </form>
                </div>

                {/* Right Profile & Sign Out */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col text-right">
                        <span className="text-xs font-bold text-slate-800">{userName}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{userRole || 'Admin'}</span>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
                        className="text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
                        title="Sign Out"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content (Now takes 100% full screen width!) */}
            <main className="flex-1 min-w-0">
                <Heartbeat />
                {children}
            </main>
        </div>
    );
}
