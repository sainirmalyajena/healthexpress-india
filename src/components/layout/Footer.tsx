import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, ShieldCheck } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Footer({ lang, dict }: { lang: string; dict: any }) {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        services: [
            { href: `/${lang}/surgeries`, label: dict.surgical_directory || (lang === 'hi' ? 'सर्जरी डायरेक्टरी' : 'Surgical Directory') },
            { href: `/${lang}/surgeries?category=GENERAL_SURGERY`, label: dict.general_surgery || (lang === 'hi' ? 'जनरल सर्जरी' : 'General Surgery') },
            { href: `/${lang}/surgeries?category=ORTHOPEDICS`, label: dict.orthopedics || (lang === 'hi' ? 'ऑर्थोपेडिक्स' : 'Orthopedic Excellence') },
            { href: `/${lang}/surgeries?category=CARDIAC`, label: dict.cardiac_care || (lang === 'hi' ? 'कार्डियक केयर' : 'Cardiac Care') },
        ],
        company: [
            { href: `/${lang}/blog`, label: dict.blog || (lang === 'hi' ? 'चिकित्सा अंतर्दृष्टि' : 'Medical Insights') },
            { href: `/${lang}/partners`, label: dict.partners || (lang === 'hi' ? 'अस्पताल नेटवर्क' : 'Hospital Network') },
            { href: `/${lang}/contact`, label: dict.contact || (lang === 'hi' ? 'प्राइवेट कंसीयज' : 'Private Concierge') },
            { href: `/${lang}/privacy`, label: dict.privacy_protocol || (lang === 'hi' ? 'गोपनीयता प्रोटोकॉल' : 'Privacy Protocol') },
        ],
        cities: [
            { href: `/${lang}/surgeries?city=Mumbai`, label: dict.mumbai || (lang === 'hi' ? 'मुंबई एलीट' : 'Mumbai Elite') },
            { href: `/${lang}/surgeries?city=Delhi`, label: dict.delhi || (lang === 'hi' ? 'दिल्ली एनसीआर' : 'Delhi NCR') },
            { href: `/${lang}/surgeries?city=Bangalore`, label: dict.bangalore || (lang === 'hi' ? 'बैंगलोर' : 'Bangalore') },
            { href: `/${lang}/surgeries?city=Chennai`, label: dict.chennai || (lang === 'hi' ? 'चेन्नई' : 'Chennai') },
        ],
    };

    return (
        <footer className="bg-[#051c18] text-slate-400 pt-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
                    {/* Brand & Mission */}
                    <div className="lg:col-span-1">
                        <Link href={`/${lang}`} className="flex items-center mb-8 group">
                            <img
                                src="/prism-logo.jpg"
                                alt="Prism Healthcure Logo"
                                className="h-16 w-auto object-contain transition-transform group-hover:scale-105 bg-white p-2 rounded-xl"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed mb-10 text-slate-400/80 font-medium">
                            The premium surgical bridge connecting international standards of care with India&apos;s leading medical specialists. Experience healthcare redefined.
                        </p>
                        <div className="flex gap-5">
                            {[
                                { Icon: Facebook, url: "https://facebook.com/prismhealthcure" },
                                { Icon: Twitter, url: "https://twitter.com/prismhealthcure" },
                                { Icon: Linkedin, url: "https://linkedin.com/company/prismhealthcure" },
                                { Icon: Instagram, url: "https://instagram.com/prismhealthcure" }
                            ].map(({ Icon, url }, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-teal-500 hover:text-white hover:border-teal-400 transition-all duration-300" aria-label="Social Link">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Groups */}
                    <div>
                        <h3 className="text-white font-black font-outfit text-xs uppercase tracking-[0.3em] mb-8">{dict.medical_services || (lang === 'hi' ? 'चिकित्सा सेवाएं' : 'Medical Services')}</h3>
                        <ul className="space-y-4">
                            {footerLinks.services.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm font-medium hover:text-teal-400 transition-colors flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-900 group-hover:bg-teal-400 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-black font-outfit text-xs uppercase tracking-[0.3em] mb-8">{dict.establishment || (lang === 'hi' ? 'प्रतिष्ठान' : 'Establishment')}</h3>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-sm font-medium hover:text-teal-400 transition-colors flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-teal-900 group-hover:bg-teal-400 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Elite */}
                    <div>
                        <h3 className="text-white font-black font-outfit text-xs uppercase tracking-[0.3em] mb-8">{dict.private_access || (lang === 'hi' ? 'निजी संपर्क' : 'Private Access')}</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-teal-400/5 border border-teal-400/10 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-4 h-4 text-teal-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-teal-400/50 mb-1">{dict.direct_line || (lang === 'hi' ? 'सीधा संपर्क' : 'Direct Line')}</p>
                                    <a href="tel:9307861041" className="text-white font-bold text-sm hover:text-teal-400 transition-colors">93078-61041</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-teal-400/5 border border-teal-400/10 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-4 h-4 text-teal-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-teal-400/50 mb-1">{dict.inquiries || (lang === 'hi' ? 'पूछताछ' : 'Inquiries')}</p>
                                    <a href="mailto:contact@prismhealthcure.com" className="text-white font-bold text-sm hover:text-teal-400 transition-colors">contact@prismhealthcure.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Precision Protocol */}
            <div className="border-t border-white/5 bg-black/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                        {/* Medical Compliance */}
                        <div className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 max-w-2xl">
                            <ShieldCheck className="w-8 h-8 text-teal-400 flex-shrink-0" />
                            <p className="text-[10px] uppercase font-bold leading-relaxed tracking-wider text-slate-500">
                                <strong className="text-teal-400">Security Protocol:</strong> {dict.disclaimer}
                            </p>
                        </div>

                        <div className="flex flex-col items-center lg:items-end gap-4">
                            <div className="flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                                <Link href={`/${lang}/privacy`} className="hover:text-teal-400 transition-colors">Privacy</Link>
                                <Link href={`/${lang}/terms`} className="hover:text-teal-400 transition-colors">Terms</Link>
                                <Link href={`/${lang}/sitemap`} className="hover:text-teal-400 transition-colors">Sitemap</Link>
                            </div>
                            <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest">
                                © {currentYear} Prism Healthcure Concierge. {dict.rights}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
