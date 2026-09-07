'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface LeadStatusSelectProps {
    leadId: string;
    currentStatus: string;
    statuses: string[];
    onUpdate?: (newStatus: string) => void;
}

export default function LeadStatusSelect({ leadId, currentStatus, statuses, onUpdate }: LeadStatusSelectProps) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (!newStatus) return;

        // 1. INSTANT Optimistic UI Update (0ms)
        setStatus(newStatus);
        if (onUpdate) onUpdate(newStatus);

        // 2. FIRE AND FORGET - Do not wait for the 7s Tokyo database round-trip!
        fetch(`/api/dashboard/leads/${leadId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        }).then(() => {
            // Silently update Next.js cache in the background
            router.refresh();
        }).catch((err) => {
            console.error("Failed to update status in background", err);
            // Revert on failure
            setStatus(currentStatus);
            if (onUpdate) onUpdate(currentStatus);
        });
    };

    return (
        <select
            value={status}
            onChange={handleChange}
            className="text-xs font-semibold rounded-full px-3 py-1 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 transition-colors"
        >
            {statuses.map((s) => (
                <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                </option>
            ))}
        </select>
    );
}
