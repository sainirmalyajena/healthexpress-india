import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock, Building2, HeartPulse, IndianRupee, ShieldCheck,
  CheckCircle2, ArrowRight, Phone, Lock, UserPlus, HeartHandshake, MapPin
} from 'lucide-react';
import { LeadForm } from '@/components/forms';

export const metadata: Metadata = {
  title: 'Ankle Surgery Cost in India (2026) | Top Surgeons | HealthExpress',
  description: 'Find the exact Ankle Surgery cost in India & Delhi (₹80,000 - ₹2,50,000). Get free quotes, connect with top orthopedic surgeons, and check 100% cashless insurance.',
  keywords: [
    'Ankle Surgery Cost in India',
    'Ankle Surgery Cost in Delhi',
    'Ankle Replacement Cost',
    'Ankle Fusion Cost',
    'Best Ankle Surgeon India',
    'Ankle Arthroscopy',
    'Orthopedic hospital India'
  ],
  alternates: {
    canonical: 'https://www.healthexpressindia.com/en/campaign/ankle-surgery',
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default async function AnkleSurgeryCampaignPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does ankle surgery cost in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The ankle surgery cost in India typically ranges from ₹80,000 to ₹2,50,000. Minor arthroscopy is on the lower end, while total ankle replacement or complex fusion surgery falls on the higher end."
        }
      },
      {
        "@type": "Question",
        "name": "How much does ankle surgery cost in Delhi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In Delhi, the cost for ankle surgery is highly competitive, starting from ₹1,20,000 at top NABH/JCI accredited hospitals, including surgeon fees and OT charges."
        }
      }
    ]
  };

  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": "Ankle Surgery",
    "procedureType": "Surgical",
    "bodyLocation": "Ankle",
    "description": "Surgical intervention to treat ankle arthritis, fractures, or instability using arthroscopy, fusion, or total replacement techniques.",
  };

  const whatsappMsg = encodeURIComponent("Hi HealthExpress, I need an exact quote for Ankle Surgery.");

  return (
    <div className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }} />

      {/* Hero Section */}
      <div className="relative bg-slate-900 border-b border-teal-900/50 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1579684453423-f84349ef60b0?q=60&w=1200&auto=format&fit=crop" 
            alt="Ankle Surgery in India"
            fill
            sizes="100vw"
            quality={60}
            priority
            className="object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 text-center md:text-left">
          <div className="max-w-3xl">
            <span className="inline-block text-xs font-bold text-teal-300 bg-teal-900/50 border border-teal-400/30 px-3 py-1.5 rounded-full mb-6">
              #1 ORTHOPEDIC NETWORK IN INDIA
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Ankle Surgery Cost in India: <br/>
              <span className="text-teal-400">Save up to 40% Today</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-8 font-medium max-w-2xl">
              Get treated by India's top Orthopedic surgeons. Complete transparency. Zero hidden fees. 100% Cashless Insurance available.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl backdrop-blur-sm">
                <IndianRupee className="w-5 h-5 text-teal-400 mb-2" />
                <p className="text-xs text-slate-400">Starting Cost</p>
                <p className="text-lg font-bold text-white">₹80,000</p>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl backdrop-blur-sm">
                <Clock className="w-5 h-5 text-teal-400 mb-2" />
                <p className="text-xs text-slate-400">Surgery Time</p>
                <p className="text-lg font-bold text-white">1-2 Hours</p>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl backdrop-blur-sm">
                <Building2 className="w-5 h-5 text-teal-400 mb-2" />
                <p className="text-xs text-slate-400">Hospital Stay</p>
                <p className="text-lg font-bold text-white">1-2 Days</p>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl backdrop-blur-sm">
                <HeartPulse className="w-5 h-5 text-teal-400 mb-2" />
                <p className="text-xs text-slate-400">Recovery</p>
                <p className="text-lg font-bold text-white">4-8 Weeks</p>
              </div>
            </div>
            
            <div className="md:hidden">
                <a href="#quote-form" className="block w-full py-4 text-center bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg">
                    Get Free Cost Estimate
                </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            
            {/* Cost Breakdown */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Ankle Surgery Cost in India & Delhi</h2>
              <p className="text-slate-700 mb-6 leading-relaxed">
                The total cost of ankle surgery in India depends on the specific procedure required (Arthroscopy, Fusion, or Total Replacement), the choice of implant, and the city. 
              </p>
              
              <div className="overflow-x-auto rounded-xl border border-slate-200 mb-8">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-bold">Procedure Type</th>
                      <th className="px-6 py-4 font-bold">Estimated Cost (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-teal-700">Ankle Arthroscopy (Minimally Invasive)</td>
                      <td className="px-6 py-4">₹80,000 - ₹1,20,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-teal-700">Ankle Fusion (Arthrodesis)</td>
                      <td className="px-6 py-4">₹1,20,000 - ₹1,80,000</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-teal-700">Total Ankle Replacement</td>
                      <td className="px-6 py-4">₹2,00,000 - ₹3,50,000+</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="text-teal-600 w-5 h-5"/> Cost in Delhi & Major Cities
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Delhi and Mumbai serve as major hubs for advanced orthopedics. <strong>Ankle surgery cost in Delhi</strong> is highly optimized due to the presence of multiple NABH accredited hospitals, making it a preferred destination for both domestic and international patients. Prices in Delhi typically start from ₹1,20,000 for standard procedures, inclusive of surgeon fees and OT charges.
              </p>
            </section>

            {/* Why Choose Us */}
            <section className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl shadow-sm border border-teal-100 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Choose HealthExpress for Your Surgery?</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex gap-4">
                        <ShieldCheck className="w-8 h-8 text-teal-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">Top NABH/JCI Hospitals</h4>
                            <p className="text-sm text-slate-600">Strictly audited premium hospitals for maximum safety.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <HeartHandshake className="w-8 h-8 text-teal-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">100% Cashless Insurance</h4>
                            <p className="text-sm text-slate-600">We handle the paperwork and get approvals within 30 mins.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <UserPlus className="w-8 h-8 text-teal-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">Dedicated Care Buddy</h4>
                            <p className="text-sm text-slate-600">Personal assistance from admission to discharge.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <CheckCircle2 className="w-8 h-8 text-teal-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-bold text-slate-900 mb-1">Zero Wait-time</h4>
                            <p className="text-sm text-slate-600">Priority surgeon appointments and seamless admission.</p>
                        </div>
                    </div>
                </div>
            </section>

          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-1 mt-8 lg:mt-0" id="quote-form">
            <div className="sticky top-24 space-y-5">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border-2 border-teal-500 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Free Expert Consultation</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Get an Exact Quote</h2>
                <p className="text-sm text-slate-500 mb-6">Fill out the form below to connect with an orthopedic specialist and check your insurance coverage.</p>
                
                <LeadForm surgeryId="cmsau4td6000vwgwc8pll7sa1" surgeryName="Ankle Surgery" />
                
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <p className="text-xs text-slate-500">100% Secure & Confidential</p>
                </div>
              </div>

              <a
                href={`https://wa.me/919307861041?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-900/20"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white" aria-hidden="true">
                  <path d="M12.0117 2C6.50574 2 2.02344 6.47837 2.02344 11.9841C2.02344 13.7485 2.48297 15.4678 3.37032 17.009L2 22L7.12596 20.6559C8.61867 21.4672 10.3061 21.8973 12.0117 21.8973H12.0159C17.5218 21.8973 22.0041 17.4189 22.0041 11.913C22.0041 9.25621 20.9723 6.7728 19.0988 4.8993C17.2253 3.0258 14.7171 2 12.0117 2ZM17.4299 14.8804C17.1329 14.7317 15.672 14.0135 15.3995 13.9142C15.127 13.815 14.9288 13.8646 14.7306 14.1624C14.5323 14.4594 13.9623 15.1287 13.7889 15.327C13.6154 15.5252 13.4419 15.55 13.1448 15.4013C12.8478 15.2524 11.8896 14.9388 10.7516 13.9242C9.86422 13.1325 9.26514 12.155 8.96807 11.6591C8.671 11.1632 8.93661 10.8878 9.08518 10.74C9.21855 10.6074 9.38202 10.3941 9.53059 10.2206C9.67917 10.0471 9.72877 9.92316 9.82796 9.72477C9.92715 9.52638 9.87755 9.35286 9.80315 9.20405C9.72875 9.05525 9.13426 7.59247 8.88636 6.9967C8.63845 6.42555 8.39055 6.50058 8.19236 6.50058C7.82065 6.47513 7.62247 6.47513C7.10234 6.54955 6.82998 6.84662C6.55747 7.1437 5.78913 7.86221 5.78913 9.32788C5.78913 10.7925 6.85478 12.204 7.00335 12.4023C7.15191 12.6005 9.08331 15.5752 12.0315 16.848C12.7335 17.1517 13.2801 17.3331 13.7088 17.4691C14.5422 17.7336 15.2973 17.6957 15.8926 17.6067C16.5529 17.5079 17.9252 16.7753 18.2223 15.9324C18.5193 15.0895 18.5193 14.3713 18.4449 14.2474C18.3705 14.1235 18.1724 14.0535 17.8753 13.9048L17.4299 14.8804Z" />
                </svg>
                Chat on WhatsApp
              </a>
              
              <a
                href="tel:+919307861041"
                className="flex items-center justify-center gap-2 w-full py-4 bg-white border-2 border-slate-200 hover:border-teal-500 text-slate-700 hover:text-teal-700 font-bold rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" /> Call 93078-61041
              </a>
            </div>
          </aside>

        </div>
      </div>
      
      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-3 md:hidden shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3">
          <a
            href="tel:+919307861041"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-200"
          >
            <Phone className="w-4 h-4" /> Call
          </a>
          <a
            href="#quote-form"
            className="flex-[2] flex items-center justify-center gap-2 py-3 bg-teal-600 text-white font-bold rounded-xl shadow-lg"
          >
            Get Free Quote
          </a>
        </div>
      </div>

    </div>
  );
}
