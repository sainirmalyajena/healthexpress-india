import { prisma } from '@/lib/prisma';
import { getDoctorSession } from '@/lib/doctor-auth';
import { redirect, notFound } from 'next/navigation';
import DoctorLoginForm from '@/components/doctor/DoctorLoginForm';

interface PageProps {
    params: Promise<{ slug?: string[] }>;
}

export default async function DoctorPortalPage({ params }: PageProps) {
    const { slug = [] } = await params;

    // LOGIN PAGE
    if (slug[0] === 'login') {
        const session = await getDoctorSession();
        if (session) redirect('/doctor/dashboard');
        return <DoctorLoginForm />;
    }

    const session = await getDoctorSession();
    if (!session) redirect('/doctor/login');

    // DASHBOARD: /doctor or /doctor/dashboard
    const doctor = await prisma.doctor.findUnique({
        where: { id: session.doctorId },
        include: { surgeries: true }
    });

    if (!doctor) redirect('/doctor/login');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">My Profile</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-500">Name</label>
                                <p className="font-medium">{doctor.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-500">Qualification</label>
                                <p className="font-medium">{doctor.qualification}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-500">Experience</label>
                                <p className="font-medium">{doctor.experience} Years</p>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-500">Status</label>
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    {doctor.status}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-500 mb-1">About</label>
                            <p className="text-sm text-slate-700">{doctor.about}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Specializations</h2>
                    <div className="flex flex-wrap gap-2">
                        {doctor.surgeries.map(s => (
                            <span key={s.id} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700">
                                {s.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-2">Availability</h3>
                    <p className="text-sm text-blue-700 mb-4">
                        Set your weekly availability for appointments.
                    </p>
                    <button className="w-full bg-white text-blue-600 font-medium py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors">
                        Manage Availability
                    </button>
                </div>
            </div>
        </div>
    );
}

export const dynamic = 'force-dynamic';
