import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const revalidate = 0; // Disable caching so dashboard is always fresh

export default async function AdminAppointmentsPage() {
    const appointments = await prisma.appointment.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="min-h-screen bg-slate-50 p-8 pt-32">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">AI Voice Appointments</h1>
                        <p className="text-slate-500 mt-1">Live dashboard of all appointments booked by Sarah (AI).</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-semibold text-slate-600">Patient Name</th>
                                    <th className="p-4 font-semibold text-slate-600">Phone Number</th>
                                    <th className="p-4 font-semibold text-slate-600">Requested Date</th>
                                    <th className="p-4 font-semibold text-slate-600">Status</th>
                                    <th className="p-4 font-semibold text-slate-600">Booked On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-500">
                                            No appointments booked yet. Call the AI and book one!
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((apt) => (
                                        <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-900">{apt.patientName}</td>
                                            <td className="p-4 text-slate-600">{apt.patientPhone}</td>
                                            <td className="p-4 text-slate-600">{apt.reason || "N/A"}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500 text-sm">
                                                {format(new Date(apt.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
