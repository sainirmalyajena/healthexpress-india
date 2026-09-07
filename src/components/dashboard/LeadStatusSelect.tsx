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
    const [isUpdating, setIsUpdating] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (!newStatus) return;

        // Optimistic UI Update
        setStatus(newStatus);
        if (onUpdate) onUpdate(newStatus);

        setIsUpdating(true);
        try {
            await fetch(`/api/dashboard/leads/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <select
            value={status}
            onChange={handleChange}
            disabled={isUpdating}
            className={`text-xs font-semibold rounded-full px-3 py-1 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 transition-colors ${
                isUpdating ? 'opacity-50' : ''
            }`}
        >
            {statuses.map((s) => (
                <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                </option>
            ))}
        </select>
    );
}
