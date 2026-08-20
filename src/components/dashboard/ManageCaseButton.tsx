'use client';

import { useState } from 'react';
import CaseManagerModal from './CaseManagerModal';

interface ManageCaseButtonProps {
    lead: any;
    hospitals: any[];
}

export default function ManageCaseButton({ lead, hospitals }: ManageCaseButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
                Update Details
            </button>

            {isOpen && (
                <CaseManagerModal
                    lead={lead}
                    hospitals={hospitals}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
