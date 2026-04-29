import Link from 'next/link';
import { FiArrowLeft, FiHome, FiSearch, FiHelpCircle } from 'react-icons/fi';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* Icon & Title */}
                <div className="space-y-4">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-75" />
                        <div className="relative bg-white p-6 rounded-full shadow-md text-6xl">
                            🏥
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        404: Page Not Found <br />
                        <span className="text-2xl md:text-3xl font-semibold text-slate-500">पृष्ठ नहीं मिला</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-10 max-w-md mx-auto">
                        We couldn&apos;t find the page you&apos;re looking for. <br />
                        हमें वह पृष्ठ नहीं मिला जिसे आप खोज रहे हैं।
                    </p>
                </div>

                {/* Helpful Links Grid */}
                <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                    <Link
                        href="/"
                        className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all"
                    >
                        <div className="p-2 bg-teal-50 rounded-lg text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <FiHome size={20} />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900">Go Home / मुख्य पृष्ठ</div>
                            <div className="text-sm text-slate-500">Return to the start / घर लौटें</div>
                        </div>
                    </Link>

                    <Link
                        href="/surgeries"
                        className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all"
                    >
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <FiSearch size={20} />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900">Surgeries / सर्जरी खोजें</div>
                            <div className="text-sm text-slate-500">Browse treatments / उपचार देखें</div>
                        </div>
                    </Link>

                    <Link
                        href="/doctors"
                        className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all"
                    >
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <FiHelpCircle size={20} />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900">Our Doctors / हमारे डॉक्टर</div>
                            <div className="text-sm text-slate-500">Meet our specialists / विशेषज्ञों से मिलें</div>
                        </div>
                    </Link>

                    <Link
                        href="/contact"
                        className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all"
                    >
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <FiArrowLeft size={20} />
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900">Contact Us / संपर्क करें</div>
                            <div className="text-sm text-slate-500">Get clinical help / सहायता प्राप्त करें</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
