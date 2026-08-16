'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export function DoctorSearchBar({ lang }: { lang: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) {
            params.set('q', query.trim());
        } else {
            params.delete('q');
        }
        router.push(`/${lang}/doctors?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto mb-8">
            <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={lang === 'hi' ? 'डॉक्टर का नाम या विभाग खोजें...' : 'Search doctor name or department...'}
                    className="block w-full pl-11 pr-32 py-4 text-base bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-shadow hover:shadow-md"
                />
                <button
                    type="submit"
                    className="absolute right-2 px-6 py-2 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
                >
                    {lang === 'hi' ? 'खोजें' : 'Search'}
                </button>
            </div>
        </form>
    );
}
