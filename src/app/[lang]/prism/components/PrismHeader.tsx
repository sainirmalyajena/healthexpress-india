'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PrismHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "#treatments", label: "Specialties" },
    { href: "#doctors", label: "Specialists" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-[100] transition-all duration-300",
      scrolled || isOpen ? "bg-white shadow-md py-3" : "bg-white/80 backdrop-blur-md py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="#hero" className="flex items-center gap-2 text-2xl font-bold text-teal-700" onClick={() => setIsOpen(false)}>
          <Eye className="w-8 h-8" />
          <span>Prism <span className="text-gray-900">Healthcure</span></span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-teal-700 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
          <Link href="#appointment" className="bg-teal-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-800 transition-all shadow-md">
            Book Appointment
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed inset-x-0 top-[72px] bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-2xl transition-all duration-300 md:hidden overflow-hidden z-[100]",
        isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      )}>
        <nav className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-lg font-semibold text-gray-800 hover:text-teal-700 py-2 border-b border-gray-50 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            href="#appointment" 
            className="mt-2 bg-teal-700 text-white px-6 py-4 rounded-xl font-bold text-center shadow-lg active:scale-95 transition-transform"
            onClick={() => setIsOpen(false)}
          >
            Book Appointment
          </Link>
        </nav>
      </div>
    </header>
  );
}
