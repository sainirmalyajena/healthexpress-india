import Link from 'next/link';
import Image from 'next/image';

export function Footer({ lang, dict }: { lang: string; dict: any }) {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        services: [
            { href: `/${lang}/surgeries`, label: 'All Surgeries' },
            { href: `/${lang}/surgeries?category=GENERAL_SURGERY`, label: 'General Surgery' },
            { href: `/${lang}/surgeries?category=ORTHOPEDICS`, label: 'Orthopedics' },
            { href: `/${lang}/surgeries?category=CARDIAC`, label: 'Cardiac Surgery' },
        ],
        company: [
            { href: `/${lang}/blog`, label: dict.blog || 'Medical Blog' },
            { href: `/${lang}/partners`, label: dict.partners || 'Hospital Partners' },
            { href: `/${lang}/contact`, label: dict.contact || 'Contact Us' },
            { href: `/${lang}/privacy`, label: 'Privacy Policy' },
            { href: `/${lang}/terms`, label: 'Terms of Service' },
        ],
        cities: [
            { href: `/${lang}/surgeries?city=Mumbai`, label: 'Mumbai' },
            { href: `/${lang}/surgeries?city=Delhi`, label: 'Delhi' },
            { href: `/${lang}/surgeries?city=Bangalore`, label: 'Bangalore' },
            { href: `/${lang}/surgeries?city=Chennai`, label: 'Chennai' },
        ],
    };

    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href={`/${lang}`} className="flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.png"
                                alt="HealthExpress Logo"
                                width={40}
                                height={40}
                                className="w-10 h-10 object-contain"
                            />
                            <div>
                                <span className="text-xl font-bold text-white">HealthExpress</span>
                                <span className="text-xs text-slate-400 block -mt-0.5">India</span>
                            </div>
                        </Link>
                        <p className="text-sm text-slate-400 mb-4">
                            Connecting patients with quality healthcare across India. We help you find the right surgery at the right hospital.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors" aria-label="Facebook">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors" aria-label="Twitter">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors" aria-label="LinkedIn">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Services</h3>
                        <ul className="space-y-2">
                            {footerLinks.services.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cities */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Popular Cities</h3>
                        <ul className="space-y-2">
                            {footerLinks.cities.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm hover:text-teal-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                        <p className="text-xs text-slate-400 leading-relaxed">
                            <strong className="text-slate-300">Medical Disclaimer:</strong> {dict.disclaimer}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-400">
                            © {currentYear} HealthExpress India. {dict.rights}
                        </p>
                        <div className="flex gap-4 text-sm">
                            <Link href={`/${lang}/privacy`} className="hover:text-teal-400 transition-colors">
                                Privacy
                            </Link>
                            <Link href={`/${lang}/terms`} className="hover:text-teal-400 transition-colors">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
