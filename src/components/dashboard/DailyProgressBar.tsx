'use client';

import { useState, useEffect } from 'react';

interface DailyProgressProps {
    quota: number;
}

export default function DailyProgressBar({ quota }: DailyProgressProps) {
    const [callsMade, setCallsMade] = useState(0);

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                const res = await fetch('/api/activity?today=true&limit=500');
                const data = await res.json();
                const myCallCount = data.logs?.filter(
                    (l: { actionType: string }) => l.actionType === 'CALL_LOGGED'
                ).length || 0;
                setCallsMade(myCallCount);
            } catch {
                // silent
            }
        };

        fetchCalls();
        const interval = setInterval(fetchCalls, 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const percentage = Math.min((callsMade / quota) * 100, 100);
    const isComplete = callsMade >= quota;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">
                    {isComplete ? '?? ' : '?? '}Daily Call Goal
                </span>
                <span className={`text-sm font-bold ${isComplete ? 'text-green-600' : 'text-teal-600'}`}>
                    {callsMade} / {quota}
                </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${
                        isComplete
                            ? 'bg-gradient-to-r from-green-400 to-green-500'
                            : 'bg-gradient-to-r from-teal-400 to-teal-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {isComplete && (
                <p className="text-xs text-green-600 font-medium mt-1.5">Excellent work! Target achieved!</p>
            )}
        </div>
    );
}

