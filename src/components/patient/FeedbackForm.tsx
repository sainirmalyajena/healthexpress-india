'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackForm() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/patient/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'feedback', rating, feedback }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit feedback');
            }

            setIsSubmitted(true);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center animate-fade-in">
                <div className="text-3xl mb-2">🎉</div>
                <h3 className="text-green-900 font-bold">Thank you for your feedback!</h3>
                <p className="text-green-700 text-sm">We&apos;re glad to have been part of your journey.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-2">How was your experience?</h3>
            <p className="text-sm text-slate-500 mb-6">Your feedback helps us provide better care for future patients.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`text-3xl transition-all ${(hover || rating) >= star ? 'text-yellow-400 scale-110' : 'text-slate-200'
                                }`}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </button>
                    ))}
                </div>

                <div>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your thoughts on the hospital, surgery, and our support..."
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm min-h-[100px] resize-none"
                    />
                </div>

                {error && <p className="text-xs text-red-500 text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-all disabled:opacity-50 shadow-lg shadow-teal-100 active:scale-[0.98]"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
}
