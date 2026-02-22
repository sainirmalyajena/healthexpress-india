import { redirect } from 'next/navigation';
import { getPartnerSession } from '@/lib/partner-auth';

export default async function PartnerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getPartnerSession();

    if (!session) {
        redirect('/partner/login');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">H</span>
                        </div>
                        <span className="font-semibold text-slate-900">Partner Portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">{session.name}</span>
                        <PartnerLogoutButton />
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}

// Client component for logout logic inline or imported
// For simplicity, defining here but normally would be separate file
// To make this work in Server Component file, I'll extract it in next tool call or usage
// Actually, I can't put client component code inside server component file directly without "use client"
// I will create a separate LogoutButton component.
// For now, I'll put a placeholder link that we can enhance later or use a form action.
function PartnerLogoutButton() {
    return (
        <form action="/api/partner/auth" method="POST">
            <input type="hidden" name="action" value="logout" />
            <button type="submit" className="text-sm text-slate-500 hover:text-slate-700">
                Logout
            </button>
        </form>
    );
}
