import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const revalidate = 0; // Disable caching so dashboard is always fresh

export default async function AdminLeadsPage() {
    const leads = await prisma.lead.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="min-h-screen bg-slate-50 p-8 pt-32">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Website Form Leads</h1>
                        <p className="text-slate-500 mt-1">Live dashboard of all patient inquiries submitted through website forms.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="p-4 font-semibold text-slate-600">Patient Name</th>
                                    <th className="p-4 font-semibold text-slate-600">Contact</th>
                                    <th className="p-4 font-semibold text-slate-600">Source</th>
                                    <th className="p-4 font-semibold text-slate-600">Description / Inquiry</th>
                                    <th className="p-4 font-semibold text-slate-600">Status</th>
                                    <th className="p-4 font-semibold text-slate-600">Submitted On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">
                                            No form leads submitted yet.
                                        </td>
                                    </tr>
                                ) : (
                                    leads.map((lead) => (
                                        <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium text-slate-900">{lead.fullName}</td>
                                            <td className="p-4 text-slate-600">
                                                <div>{lead.phone}</div>
                                                {lead.email && <div className="text-xs text-slate-400">{lead.email}</div>}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lead.utmSource ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                                    {lead.utmSource ? `Ads (${lead.utmSource})` : 'Organic (SEO)'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-600 max-w-xs truncate" title={lead.description}>
                                                {lead.description || "N/A"}
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-500 text-sm">
                                                {format(new Date(lead.createdAt), "MMM d, yyyy 'at' h:mm a")}
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
