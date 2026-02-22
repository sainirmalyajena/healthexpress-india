import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPatientSession } from "@/lib/patient-auth";
import {
    Clock,
    CheckCircle2,
    Stethoscope,
    FileText,
    ShieldCheck,
    MapPin,
    Calendar,
    ArrowRight,
    TrendingUp,
    MessageSquare,
    Lock
} from "lucide-react";
import Link from "next/link";
import DocumentUpload from "@/components/patient/DocumentUpload";

export default async function PatientDashboard() {
    const patient = await getPatientSession();

    if (!patient) {
        redirect("/patient/login");
    }

    const lead = await prisma.lead.findUnique({
        where: { id: patient.leadId },
        include: {
            surgery: true,
            hospital: true,
            documents: true
        }
    });

    if (!lead) {
        redirect("/patient/login");
    }

    const statusSteps = [
        { status: 'NEW', label: 'Inquiry Received', icon: MessageSquare },
        { status: 'QUALIFIED', label: 'Consultation Done', icon: Stethoscope },
        { status: 'SCHEDULED', label: 'Surgery Scheduled', icon: Calendar },
        { status: 'COMPLETED', label: 'Recovery Phase', icon: CheckCircle2 },
    ];

    const currentStatusIndex = statusSteps.findIndex(s => s.status === lead.status);
    const progressPercent = ((currentStatusIndex + 1) / statusSteps.length) * 100;

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header / Banner */}
            <div className="bg-slate-900 pt-16 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome, {lead.fullName}</h1>
                            <div className="flex items-center gap-4 text-slate-400 text-sm">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-4 h-4 text-teal-500" />
                                    Case ID: {lead.referenceId}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {lead.city}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/contact"
                                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold backdrop-blur-sm transition-all"
                            >
                                Contact Coordinator
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Progress Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Status Tracker */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900 mb-8">Surgery Progress</h2>

                            <div className="relative">
                                {/* Progress Bar Background */}
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                                {/* Progress Bar Active */}
                                <div
                                    className="absolute top-1/2 left-0 h-1 bg-teal-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>

                                <div className="relative flex justify-between items-center">
                                    {statusSteps.map((step, idx) => {
                                        const StepIcon = step.icon;
                                        const isCompleted = idx <= currentStatusIndex;
                                        const isCurrent = idx === currentStatusIndex;

                                        return (
                                            <div key={step.status} className="flex flex-col items-center">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted
                                                    ? 'bg-teal-500 border-teal-100 text-white shadow-lg shadow-teal-200'
                                                    : 'bg-white border-slate-100 text-slate-300'
                                                    }`}>
                                                    <StepIcon className="w-5 h-5" />
                                                </div>
                                                <span className={`mt-3 text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-teal-600' : isCompleted ? 'text-slate-900' : 'text-slate-400'
                                                    }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-12 p-6 bg-teal-50 rounded-2xl border border-teal-100 flex items-start gap-4">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Clock className="w-5 h-5 text-teal-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-teal-900">Current Status: {lead.status}</h3>
                                    <p className="text-sm text-teal-800/80 mt-1">
                                        We are currently {lead.status === 'NEW' ? 'reviewing your case details' : 'moving forward with your clinical plan'}. Your care coordinator will update you shortly.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Surgery Details Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Your Procedure</h2>
                                <Link
                                    href={`/surgeries/${lead.surgery.slug}`}
                                    className="text-sm font-semibold text-teal-600 hover:underline flex items-center gap-1"
                                >
                                    View Guide <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-5 bg-slate-50 rounded-2xl">
                                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Recommended Procedure</p>
                                    <p className="text-lg font-bold text-slate-900">{lead.surgery.name}</p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-2xl">
                                    <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Hospital Partner</p>
                                    <p className="text-lg font-bold text-slate-900">{lead.hospital?.name || 'Assessing Best Partner'}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">

                        {/* Financial Snapshot */}
                        <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-8 text-white shadow-xl shadow-teal-900/20">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="w-6 h-6" />
                                <h2 className="text-xl font-bold">Cost Estimate</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-teal-100 text-sm">Estimated Treatment Cost</p>
                                    <p className="text-3xl font-bold mt-1">₹{lead.discountedCost?.toLocaleString() || 'TBD'}</p>
                                    {lead.originalCost && lead.originalCost > (lead.discountedCost || 0) && (
                                        <p className="text-sm text-teal-200 line-through">₹{lead.originalCost.toLocaleString()}</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-xs text-teal-200 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Exclusive HealthExpress Discount Applied
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Lab Reports</h2>
                                <FileText className="w-5 h-5 text-slate-400" />
                            </div>

                            {lead.documents.length > 0 ? (
                                <ul className="space-y-3">
                                    {lead.documents.map(doc => (
                                        <li key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group transition-colors hover:bg-slate-100">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <span className="text-sm font-medium text-slate-700 truncate block">{doc.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.type}</span>
                                            </div>
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 bg-white text-teal-600 rounded-lg shadow-sm hover:text-teal-700 transition-colors"
                                                title="View Document"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-sm text-slate-500 mb-3">No documents uploaded</p>
                                    <DocumentUpload />
                                </div>
                            )}
                            {lead.documents.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center">
                                    <DocumentUpload />
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
