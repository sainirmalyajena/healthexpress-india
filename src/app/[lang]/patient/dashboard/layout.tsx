import { redirect } from 'next/navigation';
import { getPatientSession } from '@/lib/patient-auth';
import Link from 'next/link';

export default async function PatientDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getPatientSession();

    if (!session) {
        redirect('/patient/login');
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="font-bold text-xl text-teal-600">HealthExpress</Link>
                        <span className="text-slate-300">|</span>
                        <span className="font-semibold text-slate-900">My Care</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-900">{session.name}</p>
                            <p className="text-xs text-slate-500">{session.phone}</p>
                        </div>
                        <PatientLogoutButton />
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}

function PatientLogoutButton() {
    return (
        <form action="/api/patient/auth" method="POST">
            <input type="hidden" name="action" value="logout" />
            <button type="submit" className="text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1 rounded-md hover:bg-slate-50">
                Logout
            </button>
        </form>
    );
}
