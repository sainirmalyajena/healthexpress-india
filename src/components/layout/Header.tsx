'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
    Phone,
    Menu,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Search,
    X,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Header({ lang, dict }: { lang: string; dict: any }) {
    const pathname = usePathname();
    const isHome = pathname === `/${lang}`;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: `/${lang}/surgeries`, label: dict.surgeries },
        { href: `/${lang}/doctors`, label: dict.doctors },
        { href: `/${lang}/blog`, label: dict.blog },
        { href: `/${lang}/partners`, label: dict.partners },
        { href: `/${lang}/contact`, label: dict.contact },
    ];

    const isActive = (href: string) => {
        if (href === `/${lang}`) return pathname === `/${lang}`;
        return pathname.startsWith(href);
    };

    const redirectedPathname = (locale: string) => {
        if (!pathname) return '/';
        const segments = pathname.split('/');
        segments[1] = locale;
        return segments.join('/');
    };

    return (
        <header
            data-deployment-id="HE_INDIA_2026_FINAL"
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                isHome ? "bg-[#022c22]" : "bg-white",
                scrolled
                    ? isHome 
                        ? "bg-[#022c22]/95 backdrop-blur-md border-b border-teal-800 shadow-sm"
                        : "bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm"
                    : "border-b border-transparent"
            )}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href={`/${lang}`} className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-premium rounded-xl">
                            <Image
                                src="/logo.png"
                                alt="HealthExpress Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className={cn("text-xl sm:text-2xl font-black font-outfit tracking-tighter", isHome ? "text-white" : "bg-gradient-to-br from-teal-700 via-teal-900 to-slate-900 bg-clip-text text-transparent")}>
                                Health<span className={cn(isHome ? "text-teal-400" : "")}>Express</span>
                            </span>
                            <span className={cn("text-[10px] uppercase tracking-widest block font-black ml-0.5", isHome ? "text-teal-300/80" : "text-teal-600/60")}>India</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex items-center gap-6 2xl:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-[13px] font-bold uppercase tracking-widest transition-all relative py-2',
                                    isActive(link.href)
                                        ? (isHome ? 'text-white' : 'text-teal-900')
                                        : (isHome ? 'text-teal-100/70 hover:text-white' : 'text-slate-500 hover:text-teal-900')
                                )}
                            >
                                <span className="relative z-10">{link.label}</span>
                                {isActive(link.href) && (
                                    <span className={cn("absolute bottom-0 left-0 right-0 h-0.5 rounded-full", isHome ? "bg-teal-400" : "bg-teal-600")} />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Language Switcher & CTA */}
                    <div className="hidden xl:flex items-center gap-8">
                        {/* Language Toggle - Premium Pill */}
                        <div className={cn("flex items-center backdrop-blur-md rounded-2xl p-1 shadow-inner", isHome ? "bg-white/5 border border-white/10" : "bg-slate-100/80 border border-slate-200/50")}>
                            <Link
                                href={redirectedPathname('en')}
                                className={cn(
                                    "px-4 py-1.5 text-[10px] font-black tracking-widest rounded-xl transition-all",
                                    lang === 'en' 
                                        ? (isHome ? "bg-teal-500 text-white shadow-sm" : "bg-white text-teal-900 shadow-sm") 
                                        : (isHome ? "text-teal-100/60 hover:text-white" : "text-slate-400 hover:text-slate-600")
                                )}
                            >
                                EN
                            </Link>
                            <Link
                                href={redirectedPathname('hi')}
                                className={cn(
                                    "px-4 py-1.5 text-[10px] font-black tracking-widest rounded-xl transition-all",
                                    lang === 'hi' 
                                        ? (isHome ? "bg-teal-500 text-white shadow-sm" : "bg-white text-teal-900 shadow-sm") 
                                        : (isHome ? "text-teal-100/60 hover:text-white" : "text-slate-400 hover:text-slate-600")
                                )}
                            >
                                HI
                            </Link>
                        </div>
                        
                        <Button
                            variant="glow"
                            size="md"
                            className="rounded-2xl shadow-premium px-8 h-12 text-sm font-bold uppercase tracking-wider"
                            onClick={() => window.location.href = `/${lang}/contact`}
                        >
                            {lang === 'hi' ? 'अनुमान प्राप्त करें' : 'Get Estimate'}
                            <ArrowUpRight className="w-4 h-4 ml-2.5" />
                        </Button>
                    </div>


                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-3 xl:hidden">
                        {/* Mobile Language Toggle */}
                        <div className="flex items-center bg-slate-100 rounded-full p-1">
                            <Link
                                href={redirectedPathname('en')}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-bold rounded-full transition-all",
                                    lang === 'en' ? "bg-white text-teal-600 shadow-sm" : "text-slate-500"
                                )}
                            >
                                EN
                            </Link>
                            <Link
                                href={redirectedPathname('hi')}
                                className={cn(
                                    "px-2 py-1 text-[10px] font-bold rounded-full transition-all",
                                    lang === 'hi' ? "bg-white text-teal-600 shadow-sm" : "text-slate-500"
                                )}
                            >
                                HI
                            </Link>
                        </div>
                        <button
                            type="button"
                            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 xl:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="absolute top-0 right-0 w-[280px] h-full bg-white shadow-2xl flex flex-col">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <span className="font-bold text-lg text-slate-800">Menu</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'block px-4 py-3 rounded-xl text-base font-medium transition-all',
                                        isActive(link.href)
                                            ? 'bg-teal-50 text-teal-700'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="p-4 border-t border-slate-100 space-y-4 pb-8">
                            <Link
                                href={`/${lang}/surgeries`}
                                className="block w-full py-3 px-4 bg-teal-600 text-white text-center font-semibold rounded-xl shadow-md active:scale-95 transition-transform"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {dict.surgeries}
                            </Link>
                            <a
                                href={`tel:${process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, '') || '9307861041'}`}
                                className="block w-full py-3 px-4 bg-slate-50 text-slate-700 text-center font-semibold rounded-xl border border-slate-200"
                            >
                                {dict.call_support}
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </header>
    );
}
