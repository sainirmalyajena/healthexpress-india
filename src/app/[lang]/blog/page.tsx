import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';
import { format } from 'date-fns';

import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'hi' ? 'मेडिकल ब्लॉग और रिकवरी गाइड | HealthExpress' : 'Medical Blog & Recovery Guides | HealthExpress India',
        description: lang === 'hi'
            ? 'विशेषज्ञ चिकित्सा सलाह, सर्जरी रिकवरी गाइड और स्वास्थ्य सुझाव। अपने स्वास्थ्य और रिकवरी यात्रा के बारे में सूचित रहें।'
            : 'Expert medical advice, surgery recovery guides, and healthcare tips from top specialists. Stay informed about your health and recovery journey.',
    };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const posts = await getSortedPostsData();
    const dictionary = await getDictionary(lang as Locale);
    const dict = dictionary.blog || {}; // Fallback if missing

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4 font-sans">
                        {lang === 'hi' ? 'चिकित्सा अंतर्दृष्टि और रिकवरी गाइड' : 'Medical Insights & Recovery Guides'}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {lang === 'hi'
                            ? 'आपकी सर्जिकल यात्रा को आत्मविश्वास के साथ नेविगेट करने में मदद करने के लिए विशेषज्ञ सलाह और रिकवरी टाइमलाइन।'
                            : 'Expert advice, recovery timelines, and healthcare tips to help you navigate your surgical journey with confidence.'}
                    </p>
                </div>

                {posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => (
                            <article key={post.slug} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                                <div className="aspect-video bg-teal-50 flex items-center justify-center overflow-hidden">
                                    <div className="text-4xl group-hover:scale-110 transition-transform duration-500">🏥</div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-md uppercase tracking-wider">
                                            {post.category}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {format(new Date(post.date), 'MMM dd, yyyy')}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                                        <Link href={`/${lang}/blog/${post.slug}`}>
                                            {post.title}
                                        </Link>
                                    </h2>

                                    <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1 italic">
                                        {post.excerpt}
                                    </p>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">By {post.author}</span>
                                        <Link
                                            href={`/${lang}/blog/${post.slug}`}
                                            className="text-teal-600 font-semibold text-sm inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                        >
                                            {lang === 'hi' ? 'पूरा लेख पढ़ें' : 'Read full article'}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <div className="text-6xl mb-6 opacity-30">📚</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{lang === 'hi' ? 'हमारा मेडिकल पुस्तकालय बढ़ रहा है' : 'Our clinical library is growing'}</h2>
                        <p className="text-slate-500">{lang === 'hi' ? 'विशेषज्ञ रिकवरी गाइड और मेडिकल अंतर्दृष्टि के लिए जल्द ही वापस आएं।' : 'Check back soon for expert recovery guides and medical insights.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
