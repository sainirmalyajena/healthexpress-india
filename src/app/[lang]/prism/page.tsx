import PrismHeader from './components/PrismHeader';
import AppointmentForm from './components/AppointmentForm';
import { Eye, Microscope, Droplets, Glasses, Target, Dna, CheckCircle2, ChevronDown, Star, MapPin, Phone, Mail, Clock, Shield, Award, Users, Heart } from 'lucide-react';
import Link from 'next/link';
import { getDictionary } from '@/get-dictionary';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ lang: any }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === 'hi' ? 'Prism Healthcure | प्रीमियम नेत्र विज्ञान और नेत्र देखभाल' : 'Prism Healthcure | Premium Ophthalmology & Eye Care',
    description: lang === 'hi' ? 'शीर्ष नेत्र विशेषज्ञों द्वारा मोतियाबिंद, लैसिक, रेटिना और ग्लूकोमा सहित उन्नत नेत्र उपचार।' : 'Advanced eye treatments including Cataract, LASIK, Retina, and Glaucoma by top eye specialists.',
  };
}

export default async function PrismHealthcurePage({ params }: PageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const d = dictionary.prism_page;

  const treatments = [
    { icon: Droplets, title: d.treatments.cataract.title, desc: d.treatments.cataract.desc },
    { icon: Glasses, title: d.treatments.lasik.title, desc: d.treatments.lasik.desc },
    { icon: Eye, title: d.treatments.retina.title, desc: d.treatments.retina.desc },
    { icon: Target, title: d.treatments.glaucoma.title, desc: d.treatments.glaucoma.desc },
    { icon: Dna, title: d.treatments.cornea.title, desc: d.treatments.cornea.desc },
    { icon: Heart, title: d.treatments.pediatric.title, desc: d.treatments.pediatric.desc },
  ];

  const doctors = [
    { name: 'Dr. Arjun Mehta', role: lang === 'hi' ? 'मुख्य नेत्र रोग विशेषज्ञ' : 'Chief Ophthalmologist', spec: d.treatments.cataract.title + ' & LASIK', exp: '18+ ' + (lang === 'hi' ? 'वर्ष' : 'Years'), img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300' },
    { name: 'Dr. Priya Sharma', role: lang === 'hi' ? 'रेटिना विशेषज्ञ' : 'Retina Specialist', spec: 'Retina & Vitreous', exp: '14+ ' + (lang === 'hi' ? 'वर्ष' : 'Years'), img: 'https://images.unsplash.com/photo-1594824476967-48c8b964ae17?auto=format&fit=crop&q=80&w=300&h=300' },
    { name: 'Dr. Vikram Singh', role: lang === 'hi' ? 'ग्लूकोमा विशेषज्ञ' : 'Glaucoma Expert', spec: 'Glaucoma & Neuro', exp: '12+ ' + (lang === 'hi' ? 'वर्ष' : 'Years'), img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300' },
  ];

  const testimonials = [
    { name: 'Rajesh Kumar', location: 'Delhi', surgery: d.treatments.cataract.title, text: lang === 'hi' ? 'Prism Healthcure में पूरा अनुभव असाधारण था। डॉ मेहता ने सब कुछ स्पष्ट रूप से समझाया और सर्जरी पूरी तरह से दर्द रहित थी।' : 'The entire experience at Prism Healthcure was exceptional. Dr. Mehta explained everything clearly and the surgery was completely painless. I can see perfectly now!', rating: 5 },
    { name: 'Sunita Devi', location: 'Noida', surgery: 'LASIK', text: lang === 'hi' ? '15 साल तक चश्मा पहनने के बाद, आखिरकार मैंने यहाँ लैसिक करवाया। प्रक्रिया में केवल 10 मिनट लगे। जीवन बदल गया!' : 'After 15 years of wearing glasses, I finally got LASIK done here. The procedure took only 10 minutes and I could see clearly the next morning. Life-changing!', rating: 5 },
    { name: 'Amit Patel', location: 'Gurgaon', surgery: d.treatments.glaucoma.title, text: lang === 'hi' ? 'उनकी उन्नत स्क्रीनिंग की बदौलत मेरे ग्लूकोमा का जल्दी पता चल गया। उपचार योजना बहुत प्रभावी रही है।' : 'My glaucoma was detected early thanks to their advanced screening. The treatment plan has been very effective. Highly recommend their expertise.', rating: 5 },
  ];

  const faqs = [
    { q: lang === 'hi' ? 'आप किस प्रकार के मोतियाबिंद लेंस प्रदान करते हैं?' : 'What types of cataract lenses do you offer?', a: lang === 'hi' ? 'हम मोनोफोकल, मल्टीफोकल, टोरिक और एक्सटेंडेड डेप्थ-ऑफ-फोकस लेंस सहित प्रीमियम आईओएल की एक पूरी श्रृंखला पेश करते हैं।' : 'We offer a full range of premium IOLs including monofocal, multifocal, toric, and extended depth-of-focus lenses. Our surgeons will recommend the best option based on your lifestyle and vision needs.' },
    { q: lang === 'hi' ? 'क्या लैसिक सर्जरी दर्दनाक है?' : 'Is LASIK surgery painful?', a: lang === 'hi' ? 'नहीं। लैसिक वस्तुतः दर्द रहित है। हम प्रक्रिया से पहले सुन्न करने वाली आई ड्रॉप्स का उपयोग करते हैं।' : 'No. LASIK is virtually painless. We use numbing eye drops before the procedure. Most patients feel only mild pressure during the 10-15 minute procedure. Recovery is quick with minimal discomfort.' },
    { q: lang === 'hi' ? 'मोतियाबिंद की सर्जरी में कितना समय लगता है?' : 'How long does cataract surgery take?', a: lang === 'hi' ? 'वास्तविक सर्जरी में प्रति आँख केवल 15-20 मिनट लगते हैं। आप उसी दिन घर जा सकते हैं।' : 'The actual surgery takes only 15-20 minutes per eye. You can go home the same day. Most patients notice improved vision within 24-48 hours.' },
    { q: lang === 'hi' ? 'क्या आप बीमा स्वीकार करते हैं?' : 'Do you accept insurance?', a: lang === 'hi' ? 'हाँ, हम सभी प्रमुख बीमा प्रदाताओं के साथ काम करते हैं और अपनी सुविधा पर कैशलेस उपचार प्रदान करते हैं।' : 'Yes, we work with all major insurance providers and offer cashless treatment at our facility. Our team will help you with all insurance paperwork and pre-authorization.' },
    { q: lang === 'hi' ? 'लैसिक सर्जरी की लागत क्या है?' : 'What is the cost of LASIK surgery?', a: lang === 'hi' ? 'उपयोग की जाने वाली तकनीक और आपकी विशिष्ट दृष्टि सुधार आवश्यकताओं के आधार पर लैसिक की लागत भिन्न होती है।' : 'LASIK costs vary based on the technology used and your specific vision correction needs. We offer transparent pricing with no hidden charges. Contact us for a personalized quote after your evaluation.' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <PrismHeader lang={lang} dict={dictionary.navigation} />

      {/* ── HERO ── */}
      <section id="hero" className="relative pt-24 md:pt-28 pb-20 md:pb-28 bg-gradient-to-br from-teal-50 via-white to-emerald-50/30 min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          <div className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100/80 text-teal-800 rounded-full text-xs md:text-sm font-bold tracking-wide backdrop-blur-sm">
              <Shield className="w-4 h-4" /> {d.header_title}
            </div>
            <h1 className="text-[2.5rem] md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.08] tracking-tight">
              {lang === 'hi' ? (
                <>पूर्ण स्पष्टता के साथ<br className="hidden sm:block" /> दुनिया को <span className="text-teal-700 relative">देखें
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-teal-200" viewBox="0 0 200 12" fill="none"><path d="M2 8C50 2 150 2 198 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
              </span></>
              ) : (
                <>See the World<br className="hidden sm:block" /> with <span className="text-teal-700 relative">Perfect Clarity
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-teal-200" viewBox="0 0 200 12" fill="none"><path d="M2 8C50 2 150 2 198 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>
              </span></>
              )}
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-lg leading-relaxed">
              {d.hero_subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="#appointment" className="bg-teal-700 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20 hover:-translate-y-0.5 text-center">
                {d.book_btn}
              </Link>
              <a href="tel:9307861041" className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold text-base hover:border-teal-200 hover:bg-teal-50 transition-all text-center flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" /> {d.call_btn}
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 border-t border-gray-100 mt-6">
              {[
                { val: '25,000+', label: d.stats.patients },
                { val: '99.2%', label: d.stats.success },
                { val: '15+', label: d.stats.exp },
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
            <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">{d.specialties_title}</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">{d.comp_eye_care}</h2>
            <p className="text-gray-500 text-base md:text-lg">{d.eye_care_desc}</p>
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
            <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">{d.expert_team}</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">{d.meet_specialists}</h2>
            <p className="text-gray-500 text-base md:text-lg">{d.specialists_desc}</p>
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
              <span className="text-sm font-medium text-teal-100 leading-tight">{lang === 'hi' ? <>वर्षों की<br/>उत्कृष्टता</> : <>Years of<br/>Excellence</>}</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">{d.why_prism}</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-6">{d.vision_deserves_best}</h2>
            <p className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed">
              {d.vision_desc}
            </p>
            <div className="space-y-6">
              {d.why_points.map((f: any, i: number) => (
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
            <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">{d.patient_stories}</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3 mb-4">{d.what_patients_say}</h2>
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
            <span className="text-teal-700 font-bold text-sm uppercase tracking-widest">{d.have_questions}</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-3">{d.faqs_title}</h2>
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
              <h2 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight">{d.ready_vision.split('?')[0]}?<br/>{d.ready_vision.split('?')[1]}</h2>
              <p className="text-base md:text-lg text-teal-100 leading-relaxed max-w-md">
                {d.ready_desc}
              </p>
              <div className="flex items-center gap-3 mt-8 text-teal-200 text-sm">
                <Shield className="w-5 h-5" />
                <span>{d.confidential}</span>
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
              <div className="flex flex-col mb-6">
                <span className="text-2xl font-black font-outfit tracking-tighter leading-none text-white">
                  PRISM
                </span>
                <span className="text-[11px] uppercase tracking-[0.4em] text-teal-400 block font-black ml-0.5 mt-1">
                  Healthcure
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6 text-slate-400">{d.premium_eye_care}</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">{d.quick_links}</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="#hero" className="hover:text-teal-400 transition-colors">{dictionary.navigation.home}</Link></li>
                <li><Link href="#treatments" className="hover:text-teal-400 transition-colors">{d.specialties_title}</Link></li>
                <li><Link href="#doctors" className="hover:text-teal-400 transition-colors">{dictionary.navigation.doctors}</Link></li>
                <li><Link href="#testimonials" className="hover:text-teal-400 transition-colors">{d.patient_stories}</Link></li>
                <li><Link href="#faq" className="hover:text-teal-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">{d.services}</h4>
              <ul className="space-y-3 text-sm">
                <li>{d.treatments.cataract.title}</li>
                <li>{d.treatments.lasik.title}</li>
                <li>{d.treatments.retina.title}</li>
                <li>{d.treatments.glaucoma.title}</li>
                <li>{d.treatments.pediatric.title}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">{d.contact}</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-teal-500 shrink-0" /><a href="tel:9307861041" className="hover:text-white transition-colors">93078-61041</a></li>
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-teal-500 shrink-0" /><a href="mailto:contact@prismhealthcure.com" className="hover:text-white transition-colors">contact@prismhealthcure.com</a></li>
                <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-teal-500 shrink-0" />Mon–Sat: 8 AM – 8 PM</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Prism Healthcure. {d.all_rights}</p>
          </div>
        </div>
      </footer>

      {/* ── MOBILE STICKY CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <a href="tel:9307861041" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-teal-700 bg-teal-50 border border-teal-100 text-sm active:scale-[0.97] transition-transform">
          <Phone className="w-4 h-4" /> {dictionary.sticky_cta.call}
        </a>
        <Link href="#appointment" className="flex-1 py-3 rounded-xl font-bold text-white bg-teal-700 text-center text-sm shadow-lg shadow-teal-700/20 active:scale-[0.97] transition-transform">
          {dictionary.sticky_cta.book}
        </Link>
      </div>
    </div>
  );
}
