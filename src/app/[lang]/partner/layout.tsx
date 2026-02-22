import { getPartnerSession } from '@/lib/partner-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/dashboard/LogoutButton';

export default async function PartnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getPartnerSession();

    // Skip layout for login page
    if (!session) return <>{children}</>;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 shadow-2xl z-20">
                <div className="p-6">
                    <Link href="/partner/dashboard" className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">H</div>
                        <span className="font-bold text-lg tracking-tight">Partner Portal</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <Link
                        href="/partner/dashboard"
                        className="flex items-center gap-3 px-4 py-3 bg-teal-600 border border-teal-500 text-white rounded-xl shadow-lg shadow-teal-500/10 transition-all font-medium"
                    >
                        <span>📋</span> Dashboard
                    </Link>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-800">
                        <p className="text-xs text-slate-400 font-medium mb-1 capitalize">Logged in as</p>
                        <p className="text-sm font-bold text-slate-100 truncate mb-3">{session.name}</p>
                        <LogoutButton variant="sidebar" logoutUrl="/api/partner/auth" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Live Connection</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">HealthExpress Partner</p>
                            <p className="text-sm font-bold text-slate-700 leading-none">{session.name}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold">
                            {session.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
