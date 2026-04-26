import PrismHeader from './components/PrismHeader';
import AppointmentForm from './components/AppointmentForm';
import { Eye, Microscope, Droplets, Glasses, Target, Dna, CheckCircle2, ChevronDown, Star, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Prism Healthcure | Premium Ophthalmology & Eye Care',
  description: 'Prism Healthcure offers advanced eye treatments including Cataract, LASIK, Retina, and Glaucoma by top eye specialists in a state-of-the-art facility.',
};

export default function PrismHealthcurePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      <PrismHeader />

      {/* Hero Section */}
      <section id="hero" className="pt-28 md:pt-32 pb-32 md:pb-20 bg-gradient-to-br from-teal-50 to-white min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 text-left">
            <div className="inline-block px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-xs md:text-sm font-bold tracking-wide">
              Advanced Eye Care
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              See the World with <br className="hidden md:block"/><span className="text-teal-700">Perfect Clarity</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg lg:mx-0 leading-relaxed">
              Prism Healthcure offers state-of-the-art ophthalmology services. From advanced LASIK to pediatric eye care, trust our experts for a brighter tomorrow.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-start gap-4 pt-4 max-w-sm lg:max-w-none">
              <Link href="#appointment" className="bg-teal-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-800 transition-all shadow-lg hover:-translate-y-1 text-center">
                Book an Appointment
              </Link>
              <Link href="#treatments" className="border-2 border-teal-700 text-teal-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-teal-50 transition-all text-center">
                Explore Treatments
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-8 border-t border-gray-200 mt-8">
              <div>
                <span className="block text-2xl md:text-3xl font-black text-gray-900">25k+</span>
                <span className="text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-wider">Patients</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-black text-gray-900">99%</span>
                <span className="text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-wider">Success</span>
              </div>
              <div>
                <span className="block text-2xl md:text-3xl font-black text-gray-900">20+</span>
                <span className="text-[10px] md:text-sm font-medium text-gray-500 uppercase tracking-wider">Doctors</span>
              </div>
            </div>
          </div>
          
          <div className="relative mt-8 lg:mt-0">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800" alt="Premium Ophthalmology Clinic" className="w-full h-full object-cover" />
            </div>
            {/* Floating Card - Adjusted for Mobile */}
            <div className="absolute -bottom-6 right-4 md:-bottom-6 md:-right-6 bg-white p-4 md:p-6 rounded-2xl shadow-xl flex items-center gap-3 md:gap-4 animate-bounce" style={{ animationDuration: '3s', zIndex: 10 }}>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700">
                <Microscope className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm md:text-base">Advanced Tech</h4>
                <p className="text-xs text-gray-500">Latest equipment</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Treatments Section */}
      <section id="treatments" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-left md:text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Eye Care Specialties</h2>
            <p className="text-lg text-gray-600">Comprehensive diagnostic and therapeutic treatments tailored to your vision needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cards */}
            {[
              { icon: Droplets, title: 'Cataract Surgery', desc: 'Advanced laser-assisted cataract removal with premium IOL implants.' },
              { icon: Glasses, title: 'LASIK & Refractive', desc: 'Painless, bladeless laser vision correction to free you from glasses.' },
              { icon: Eye, title: 'Retina Care', desc: 'Specialized treatments for diabetic retinopathy and macular degeneration.' },
              { icon: Target, title: 'Glaucoma Clinic', desc: 'Early detection and advanced medical, laser, and surgical management.' },
              { icon: Dna, title: 'Cornea Services', desc: 'Comprehensive care for corneal diseases including transplants.' },
              { icon: Eye, title: 'Pediatric Ophthalmology', desc: 'Gentle expert eye care for children, addressing squints and lazy eye.' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:border-teal-100">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-700 mb-6">
                  <t.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{t.desc}</p>
                <Link href="#" className="inline-flex items-center text-teal-700 font-bold hover:gap-2 transition-all">
                  Learn more <span className="ml-2">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800" alt="Advanced Eye Surgery" className="w-full h-[400px] md:h-[600px] object-cover" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-teal-700 text-white p-4 md:p-6 rounded-2xl shadow-xl flex items-center gap-3 md:gap-4">
              <span className="text-4xl md:text-5xl font-black">15+</span>
              <span className="text-sm md:font-medium text-teal-50 leading-tight">Years of<br/>Excellence</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Prism Healthcure?</h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              We combine top-tier medical expertise with cutting-edge technology and compassionate care to deliver unparalleled visual outcomes.
            </p>
            
            <div className="space-y-8">
              {[
                { title: 'State-of-the-art Technology', desc: 'Using the latest diagnostic and surgical equipment.' },
                { title: 'Internationally Trained Doctors', desc: 'Our specialists bring global expertise to your care.' },
                { title: 'Patient-Centric Approach', desc: 'Comfortable, transparent, and ethical healthcare.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="w-8 h-8 text-teal-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{f.title}</h4>
                    <p className="text-gray-600">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Appointment CTA */}
      <section id="appointment" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-teal-700 rounded-3xl md:rounded-[2.5rem] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center shadow-2xl">
            <div className="text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready for Better Vision?</h2>
              <p className="text-lg md:text-xl text-teal-100 leading-relaxed max-w-lg">
                Schedule a comprehensive eye checkup or consultation with our experts today. Your vision is our priority.
              </p>
            </div>
            
            {/* The Client Form Component */}
            <AppointmentForm />
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
              <Eye className="w-8 h-8 text-teal-500" />
              Prism Healthcure
            </div>
            <p className="mb-6 leading-relaxed">Delivering premium, compassionate, and advanced ophthalmology care to illuminate your life.</p>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="#hero" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#treatments" className="hover:text-white transition-colors">Specialties</Link></li>
              <li><Link href="#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-teal-500 shrink-0 mt-1" /> 123 Health Avenue, Medical District</li>
              <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-teal-500 shrink-0" /> +1 (800) 123-4567</li>
              <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-teal-500 shrink-0" /> contact@prismhealthcure.com</li>
              <li className="flex items-center gap-3"><Clock className="w-5 h-5 text-teal-500 shrink-0" /> Mon-Sat: 8:00 AM - 8:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; 2026 Prism Healthcure. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
