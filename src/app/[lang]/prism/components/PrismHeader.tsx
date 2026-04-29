'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PrismHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLinks = [
    { href: "#treatments", label: "Specialties" },
    { href: "#doctors", label: "Our Doctors" },
    { href: "#testimonials", label: "Reviews" },
    { href: "#faq", label: "FAQ" },
    { href: "#appointment", label: "Contact" },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-[100] transition-all duration-500",
      scrolled
        ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] py-2"
        : "bg-white/70 backdrop-blur-md py-4"
    )}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        {/* Logo - Premium Text Design */}
        <Link href="#hero" className="flex flex-col group transition-all" onClick={() => setIsOpen(false)}>
          <span className="text-xl md:text-2xl font-black font-outfit tracking-tighter leading-none bg-gradient-to-br from-teal-700 via-teal-900 to-slate-900 bg-clip-text text-transparent group-hover:from-teal-600 group-hover:to-teal-800">
            PRISM
          </span>
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-teal-600/70 block font-black ml-0.5 mt-0.5 group-hover:text-teal-600 transition-colors">
            Healthcure
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="px-4 py-2 text-[13px] font-semibold text-slate-600 hover:text-teal-700 rounded-lg hover:bg-teal-50/60 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <a 
            href="tel:9307861041" 
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-700 transition-colors"
          >
            <Phone className="w-4 h-4" />
            93078-61041
          </a>
          <Link 
            href="#appointment" 
            className="bg-teal-700 text-white px-7 py-3 rounded-full text-sm font-bold hover:bg-teal-800 transition-all shadow-lg shadow-teal-700/20 hover:shadow-teal-700/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Full-Screen Drawer */}
      <div className={cn(
        "fixed inset-0 top-0 bg-white z-[99] transition-all duration-400 lg:hidden flex flex-col",
        isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
      )}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex flex-col">
            <span className="text-xl font-black font-outfit tracking-tighter leading-none bg-gradient-to-br from-teal-700 to-teal-900 bg-clip-text text-transparent">
              PRISM
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-teal-600/70 block font-black ml-0.5 mt-0.5">
              Healthcure
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className="flex-1 flex flex-col px-5 pt-6 gap-1">
          {navLinks.map((link, i) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-lg font-semibold text-slate-800 hover:text-teal-700 py-4 px-4 rounded-xl hover:bg-teal-50 transition-all border-b border-slate-50 last:border-0"
              onClick={() => setIsOpen(false)}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Bottom CTAs */}
        <div className="px-5 pb-8 pt-4 space-y-3 border-t border-slate-100">
          <Link 
            href="#appointment" 
            className="block w-full bg-teal-700 text-white py-4 rounded-2xl font-bold text-center text-lg shadow-lg shadow-teal-700/20 active:scale-[0.98] transition-transform"
            onClick={() => setIsOpen(false)}
          >
            Book Appointment
          </Link>
          <a 
            href="tel:9307861041" 
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-teal-700 bg-teal-50 border border-teal-100 active:scale-[0.98] transition-transform"
          >
            <Phone className="w-5 h-5" />
            Call 93078-61041
          </a>
        </div>
      </div>
    </header>
  );
}
