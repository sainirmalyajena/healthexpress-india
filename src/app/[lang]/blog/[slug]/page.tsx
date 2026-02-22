import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getSortedPostsData } from '@/lib/blog';
import { format } from 'date-fns';
import Link from 'next/link';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string; lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, lang } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            authors: [post.author],
            publishedTime: post.date,
        },
    };
}

export async function generateStaticParams() {
    const posts = await getSortedPostsData();
    const locales = ['en', 'hi'];
    const params: { slug: string; lang: string }[] = [];

    posts.forEach((post: { slug: string }) => {
        locales.forEach(lang => {
            params.push({ slug: post.slug, lang });
        });
    });

    return params;
}

export default async function BlogPostPage({ params }: Props) {
    const { slug, lang } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const isHi = lang === 'hi';

    // Article Schema
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        name: post.title,
        description: post.excerpt,
        author: {
            '@type': 'Person',
            name: post.author
        },
        datePublished: post.date,
        medicalAudience: 'Patient',
        lastReviewed: post.date
    };

    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            {/* Article Header */}
            <header className="bg-slate-50 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Link
                        href={`/${lang}/blog`}
                        className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 mb-8 gap-1 group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                        </svg>
                        {isHi ? 'लेखों पर वापस जाएं' : 'Back to Articles'}
                    </Link>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-xs font-bold text-teal-600 bg-white border border-teal-100 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                            {post.category}
                        </span>
                        <span className="text-sm text-slate-500 italic">
                            {isHi ? 'प्रकाशित तिथि:' : 'Published on'} {format(new Date(post.date), 'MMMM dd, yyyy')}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 w-fit">
                        <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {post.author[0]}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-900">{isHi ? 'लेखक:' : 'Written by'} {post.author}</p>
                            <p className="text-xs text-slate-500">{isHi ? 'चिकित्सा विशेषज्ञ' : 'Medical Specialist'}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                <div className="prose prose-lg prose-slate prose-teal max-w-none 
          prose-headings:font-bold prose-headings:text-slate-900
          prose-p:text-slate-700 prose-p:leading-relaxed
          prose-li:text-slate-700
          prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50 prose-blockquote:p-6 prose-blockquote:rounded-xl prose-blockquote:not-italic
          prose-strong:text-slate-900
        ">
                    <MDXRemote source={post.content} />
                </div>

                {/* Footer Support CTA */}
                <section className="mt-20 p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">{isHi ? 'क्या आपको पेशेवर सलाह चाहिए?' : 'Need professional advice?'}</h3>
                        <p className="text-slate-400">{isHi ? 'हमारे देखभाल समन्वयक आपका मार्गदर्शन करने के लिए 24/7 उपलब्ध हैं।' : 'Our care coordinators are available 24/7 to guide you.'}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href={`/${lang}/contact`}
                            className="px-8 py-3 bg-teal-500 hover:bg-teal-600 rounded-xl font-bold transition-colors"
                        >
                            {isHi ? 'नि: शुल्क परामर्श प्राप्त करें' : 'Get Free Consultation'}
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
