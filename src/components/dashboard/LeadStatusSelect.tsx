'use client';

import { useState, useEffect } from 'react';

interface LeadStatusSelectProps {
    leadId: string;
    currentStatus: string;
    statuses: string[];
    onUpdate?: (newStatus: string) => void;
}

export default function LeadStatusSelect({ leadId, currentStatus, statuses, onUpdate }: LeadStatusSelectProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        setStatus(currentStatus);
    }, [currentStatus]);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        if (!newStatus || newStatus === status) return;

        const previousStatus = status;

        // 1. Instant 0ms Optimistic Update in UI
        setStatus(newStatus);
        if (onUpdate) onUpdate(newStatus);
        setIsUpdating(true);

        // 2. Background async save without blocking UI or causing full-page refresh
        try {
            const res = await fetch(`/api/dashboard/leads/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) {
                throw new Error(`Server returned status ${res.status}`);
            }
        } catch (err) {
            console.error("Failed to update status in background", err);
            // Revert on failure
            setStatus(previousStatus);
            if (onUpdate) onUpdate(previousStatus);
            alert('Could not update status. Please check your internet connection and try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <select
            value={status}
            onChange={handleChange}
            disabled={isUpdating}
            className={`text-base sm:text-xs font-semibold rounded-full px-3 py-1 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 transition-all ${
                isUpdating ? 'opacity-60 cursor-wait' : ''
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
