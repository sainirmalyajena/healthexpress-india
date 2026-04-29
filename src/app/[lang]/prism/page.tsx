import PrismHeader from './components/PrismHeader';
import AppointmentForm from './components/AppointmentForm';
import { Eye, Microscope, Droplets, Glasses, Target, Dna, CheckCircle2, ChevronDown, Star, MapPin, Phone, Mail, Clock, Shield, Award, Users, Heart } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Prism Healthcure | Premium Ophthalmology & Eye Care',
  description: 'Advanced eye treatments including Cataract, LASIK, Retina, and Glaucoma by top eye specialists.',
};

const treatments = [
  { icon: Droplets, title: 'Cataract Surgery', desc: 'Advanced laser-assisted cataract removal with premium IOL implants for crystal-clear vision restoration.' },
  { icon: Glasses, title: 'LASIK & Refractive', desc: 'Painless, bladeless laser vision correction using latest femtosecond technology.' },
  { icon: Eye, title: 'Retina Care', desc: 'Specialized treatments for diabetic retinopathy, macular degeneration, and retinal detachment.' },
  { icon: Target, title: 'Glaucoma Clinic', desc: 'Early detection and advanced medical, laser, and surgical management of glaucoma.' },
  { icon: Dna, title: 'Cornea Services', desc: 'Comprehensive care for corneal diseases including transplants and keratoconus treatment.' },
  { icon: Heart, title: 'Pediatric Eye Care', desc: 'Gentle expert eye care for children — squint correction, lazy eye, and vision screening.' },
];

const doctors = [
  { name: 'Dr. Arjun Mehta', role: 'Chief Ophthalmologist', spec: 'Cataract & LASIK', exp: '18+ Years', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Dr. Priya Sharma', role: 'Retina Specialist', spec: 'Retina & Vitreous', exp: '14+ Years', img: 'https://images.unsplash.com/photo-1594824476967-48c8b964ae17?auto=format&fit=crop&q=80&w=300&h=300' },
  { name: 'Dr. Vikram Singh', role: 'Glaucoma Expert', spec: 'Glaucoma & Neuro', exp: '12+ Years', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300' },
];

const testimonials = [
  { name: 'Rajesh Kumar', location: 'Delhi', surgery: 'Cataract Surgery', text: 'The entire experience at Prism Healthcure was exceptional. Dr. Mehta explained everything clearly and the surgery was completely painless. I can see perfectly now!', rating: 5 },
  { name: 'Sunita Devi', location: 'Noida', surgery: 'LASIK', text: 'After 15 years of wearing glasses, I finally got LASIK done here. The procedure took only 10 minutes and I could see clearly the next morning. Life-changing!', rating: 5 },
  { name: 'Amit Patel', location: 'Gurgaon', surgery: 'Glaucoma Treatment', text: 'My glaucoma was detected early thanks to their advanced screening. The treatment plan has been very effective. Highly recommend their expertise.', rating: 5 },
];

const faqs = [
  { q: 'What types of cataract lenses do you offer?', a: 'We offer a full range of premium IOLs including monofocal, multifocal, toric, and extended depth-of-focus lenses. Our surgeons will recommend the best option based on your lifestyle and vision needs.' },
  { q: 'Is LASIK surgery painful?', a: 'No. LASIK is virtually painless. We use numbing eye drops before the procedure. Most patients feel only mild pressure during the 10-15 minute procedure. Recovery is quick with minimal discomfort.' },
  { q: 'How long does cataract surgery take?', a: 'The actual surgery takes only 15-20 minutes per eye. You can go home the same day. Most patients notice improved vision within 24-48 hours.' },
  { q: 'Do you accept insurance?', a: 'Yes, we work with all major insurance providers and offer cashless treatment at our facility. Our team will help you with all insurance paperwork and pre-authorization.' },
  { q: 'What is the cost of LASIK surgery?', a: 'LASIK costs vary based on the technology used and your specific vision correction needs. We offer transparent pricing with no hidden charges. Contact us for a personalized quote after your evaluation.' },
];

export default function PrismHealthcurePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <PrismHeader />

      {/* ── HERO ── */}
      <section id="hero" className="relative pt-24 md:pt-28 pb-20 md:pb-28 bg-gradient-to-br from-teal-50 via-white to-emerald-50/30 min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100/80 text-teal-800 rounded-full text-xs md:text-sm font-bold tracking-wide backdrop-blur-sm">
              <Shield className="w-4 h-4" /> Advanced Eye Care Centre
            </div>
            <h1 className="text-[2.5rem] md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.08] tracking-tight">
              See the World<br className="hidden sm:block" /> with <span className="text-teal-700 relative">Perfect Clarity
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-teal-200" viewBox="0 0 200 12" fill="none"><path d="M2 8C50 2 150 2 198 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-lg leading-relaxed">
              Prism Healthcure delivers world-class ophthalmology care — from advanced LASIK to pediatric eye treatments. Trust our expert team for a brighter, clearer tomorrow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="#appointment" className="bg-teal-700 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20 hover:-translate-y-0.5 text-center">
                Book Free Consultation
              </Link>
              <a href="tel:9307861041" className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold text-base hover:border-teal-200 hover:bg-teal-50 transition-all text-center flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 border-t border-gray-100 mt-6">
              {[
                { val: '25,000+', label: 'Happy Patients' },
                { val: '99.2%', label: 'Success Rate' },
                { val: '15+', label: 'Years Experience' },
              ].map((s, i) => (
                <div key={i}>
                  <span className="block text-2xl md:text-3xl font-black text-gray-900">{s.val}</span>
                  <span className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative mt-4 lg:mt-0">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" alt="Premium Ophthalmology Clinic" className="w-full h-full object-cover" loading="eager" />
            </div>
            <div className="absolute -bottom-5 right-3 md:-bottom-6 md:right-6 bg-white p-4 md:p-5 rounded-2xl shadow-xl ring-1 ring-black/5 flex items-center gap-3" style={{ zIndex: 10 }}>
              <div className="w-11 h-11 bg-teal-100 rounded-xl flex items-center justify-center text-teal-700">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">NABH Accredited</h4>
                <p className="text-xs text-gray-400">Quality Certified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TREATMENTS ── */}
      <section id="treatments" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">Our Specialties</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">Comprehensive Eye Care</h2>
            <p className="text-gray-500 text-base md:text-lg">Advanced diagnostic and therapeutic treatments tailored to every vision need.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {treatments.map((t, i) => (
              <div key={i} className="group bg-white p-7 md:p-8 rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-50 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-teal-50 group-hover:bg-teal-100 rounded-2xl flex items-center justify-center text-teal-700 mb-5 transition-colors">
                  <t.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCTORS ── */}
      <section id="doctors" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">Expert Team</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">Meet Our Specialists</h2>
            <p className="text-gray-500 text-base md:text-lg">Internationally trained ophthalmologists dedicated to your vision health.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {doctors.map((d, i) => (
              <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-teal-50 transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-teal-100 to-teal-50">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{d.name}</h3>
                  <p className="text-teal-700 font-semibold text-sm mt-1">{d.role}</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">{d.spec}</span>
                    <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full">{d.exp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 order-2 lg:order-1">
            <img src="https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800" alt="Advanced Eye Surgery" className="w-full h-[350px] md:h-[500px] object-cover" loading="lazy" />
            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 bg-teal-700 text-white p-5 rounded-2xl shadow-xl flex items-center gap-4">
              <span className="text-4xl font-black">15+</span>
              <span className="text-sm font-medium text-teal-100 leading-tight">Years of<br/>Excellence</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">Why Prism Healthcure</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-6">Your Vision Deserves the Best</h2>
            <p className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed">
              We combine world-class medical expertise with cutting-edge technology and compassionate, personalized care.
            </p>
            <div className="space-y-6">
              {[
                { title: 'Latest Technology', desc: 'Femtosecond lasers, OCT imaging, and AI-powered diagnostics.' },
                { title: 'Globally Trained Doctors', desc: 'Our surgeons bring expertise from top international institutions.' },
                { title: 'Patient-First Approach', desc: 'Transparent pricing, comfortable facilities, and ethical care.' },
                { title: 'Cashless Insurance', desc: 'We work with all major insurers for hassle-free treatment.' },
              ].map((f, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{f.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">Patient Stories</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">What Our Patients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-7 md:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location} · {t.surgery}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 md:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14">
            <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">Have Questions?</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-slate-50 rounded-2xl border border-gray-100 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 md:p-6 text-left font-bold text-gray-900 text-base hover:bg-slate-100 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 ml-4 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-500 text-sm leading-relaxed -mt-1">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPOINTMENT CTA ── */}
      <section id="appointment" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-3xl p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center shadow-2xl shadow-teal-900/20">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">Ready for<br/>Better Vision?</h2>
              <p className="text-base md:text-lg text-teal-100 leading-relaxed max-w-md">
                Schedule a comprehensive eye checkup or consultation with our experts. Your vision is our priority.
              </p>
              <div className="flex items-center gap-3 mt-8 text-teal-200 text-sm">
                <Shield className="w-5 h-5" />
                <span>Your information is 100% confidential</span>
              </div>
            </div>
            <AppointmentForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <img src="/prism-logo.jpg" alt="Prism Healthcure" className="h-12 w-auto object-contain rounded-lg" />
              </div>
              <p className="text-sm leading-relaxed mb-6 text-slate-400">Premium ophthalmology care delivering advanced, compassionate eye treatments for every age.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#hero" className="hover:text-teal-400 transition-colors">Home</Link></li>
                <li><Link href="#treatments" className="hover:text-teal-400 transition-colors">Specialties</Link></li>
                <li><Link href="#doctors" className="hover:text-teal-400 transition-colors">Our Doctors</Link></li>
                <li><Link href="#testimonials" className="hover:text-teal-400 transition-colors">Reviews</Link></li>
                <li><Link href="#faq" className="hover:text-teal-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Services</h4>
              <ul className="space-y-3 text-sm">
                <li>Cataract Surgery</li>
                <li>LASIK & Refractive</li>
                <li>Retina Care</li>
                <li>Glaucoma Clinic</li>
                <li>Pediatric Eye Care</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-teal-500 shrink-0" /><a href="tel:9307861041" className="hover:text-white transition-colors">93078-61041</a></li>
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-teal-500 shrink-0" /><a href="mailto:contact@prismhealthcure.com" className="hover:text-white transition-colors">contact@prismhealthcure.com</a></li>
                <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-teal-500 shrink-0" />Mon–Sat: 8 AM – 8 PM</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Prism Healthcure. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ── MOBILE STICKY CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <a href="tel:9307861041" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-teal-700 bg-teal-50 border border-teal-100 text-sm active:scale-[0.97] transition-transform">
          <Phone className="w-4 h-4" /> Call
        </a>
        <Link href="#appointment" className="flex-1 py-3 rounded-xl font-bold text-white bg-teal-700 text-center text-sm shadow-lg shadow-teal-700/20 active:scale-[0.97] transition-transform">
          Book Now
        </Link>
      </div>
    </div>
  );
}
