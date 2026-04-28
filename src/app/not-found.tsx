import Link from 'next/link';

export default function GlobalNotFound() {
    return (
        <html lang="en">
            <body className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="text-6xl text-teal-600 font-bold">404</div>
                    <h1 className="text-3xl font-bold text-slate-900">Page Not Found</h1>
                    <p className="text-slate-600 text-lg">
                        We couldn't find the page you're looking for.
                    </p>
                    <div className="pt-4">
                        <Link 
                            href="/en"
                            className="bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors inline-block"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
