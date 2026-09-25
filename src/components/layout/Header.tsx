'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import {
    Phone,
    Menu,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Search,
    X,
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: `/${lang}/surgeries`, label: dict.surgeries },
        { href: `/${lang}/pain-mapper`, label: lang === 'hi' ? 'पेन मैपर' : 'Pain Mapper' },
        { href: `/${lang}/doctors`, label: dict.doctors },
        { href: `/${lang}#ai-report-analyzer`, label: lang === 'hi' ? 'AI विश्लेषक' : 'AI Analyzer' },
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

    // Hide main navigation on campaign landing pages
    if (pathname?.includes('/campaign/')) {
        return null;
    }

    return (
        <header
            data-deployment-id="HE_INDIA_2026_FINAL"
            className={cn(
                "sticky top-0 z-50 bg-white transition-all duration-300",
                scrolled
                    ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
                    : "border-b border-slate-100"
            )}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4 xl:gap-8 h-16 md:h-20">
                    {/* Logo */}
                    <Link href={`/${lang}`} className="flex items-center gap-3 group shrink-0">
                        <div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-premium rounded-xl">
                            <Image
                                src="/logo.png"
                                alt="HealthExpress Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl sm:text-2xl font-black font-outfit tracking-tighter bg-gradient-to-br from-teal-700 via-teal-900 to-slate-900 bg-clip-text text-transparent">
                                HealthExpress
                            </span>
                            <span className="text-[10px] uppercase tracking-widest block font-black ml-0.5 text-teal-600/60">India</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex items-center gap-5 2xl:gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'shrink-0 whitespace-nowrap text-[13px] font-bold uppercase tracking-widest transition-all relative py-2',
                                    isActive(link.href)
                                        ? 'text-teal-900'
                                        : 'text-slate-500 hover:text-teal-900'
                                )}
                            >
                                <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                                {isActive(link.href) && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-teal-600" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Language Switcher & CTA */}
                    <div className="hidden xl:flex items-center gap-4 2xl:gap-8 shrink-0">
                        {/* Language Toggle */}
                        <div className="flex items-center bg-slate-100/80 border border-slate-200/50 backdrop-blur-md rounded-2xl p-1 shadow-inner">
                            <Link
                                href={redirectedPathname('en')}
                                className={cn(
                                    "px-4 py-1.5 text-[10px] font-black tracking-widest rounded-xl transition-all",
                                    lang === 'en' 
                                        ? "bg-white text-teal-900 shadow-sm" 
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                EN
                            </Link>
                            <Link
                                href={redirectedPathname('hi')}
                                className={cn(
                                    "px-4 py-1.5 text-[10px] font-black tracking-widest rounded-xl transition-all",
                                    lang === 'hi' 
                                        ? "bg-white text-teal-900 shadow-sm" 
                                        : "text-slate-400 hover:text-slate-600"
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

            {/* Mobile Navigation Drawer (Mounted to document.body to avoid header backdrop-blur and height bugs) */}
            {mounted && mobileMenuOpen && createPortal(
                <div className="fixed inset-0 z-[9999] xl:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Drawer Panel */}
                    <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[320px] h-[100dvh] bg-white shadow-2xl flex flex-col z-[10000] border-l border-slate-100 animate-in slide-in-from-right duration-300">
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                            <div className="flex items-center gap-2.5">
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                                    <Image
                                        src="/logo.png"
                                        alt="HealthExpress Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-black text-base leading-tight text-slate-900">HealthExpress</span>
                                    <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Menu</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Language Switcher inside Drawer */}
                                <div className="flex items-center bg-slate-100 rounded-full p-0.5">
                                    <Link
                                        href={redirectedPathname('en')}
                                        className={cn(
                                            "px-2.5 py-1 text-[11px] font-bold rounded-full transition-all",
                                            lang === 'en' ? "bg-white text-teal-700 shadow-sm" : "text-slate-500"
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        EN
                                    </Link>
                                    <Link
                                        href={redirectedPathname('hi')}
                                        className={cn(
                                            "px-2.5 py-1 text-[11px] font-bold rounded-full transition-all",
                                            lang === 'hi' ? "bg-white text-teal-700 shadow-sm" : "text-slate-500"
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        HI
                                    </Link>
                                </div>

                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Nav Links */}
                        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 bg-white">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                                        isActive(link.href)
                                            ? 'bg-teal-50 text-teal-800 font-bold'
                                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span>{link.label}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-400" />
                                </Link>
                            ))}
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className="p-4 border-t border-slate-100 space-y-2.5 bg-slate-50/80 shrink-0">
                            <Link
                                href={`/${lang}/contact`}
                                className="block w-full py-3 px-4 bg-teal-700 hover:bg-teal-800 text-white text-center font-bold rounded-xl shadow-md active:scale-95 transition-all text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {lang === 'hi' ? 'मुफ्त अनुमान प्राप्त करें' : 'Get Free Estimate'}
                            </Link>
                            <a
                                href={`tel:${process.env.NEXT_PUBLIC_PHONE?.replace(/\D/g, '') || '9307861041'}`}
                                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-center font-semibold rounded-xl border border-slate-200 shadow-sm active:scale-95 transition-all text-sm"
                            >
                                <Phone className="w-4 h-4 text-teal-600" />
                                <span>{dict.call_support || 'Call Support'}</span>
                            </a>
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </header>
    );
}
