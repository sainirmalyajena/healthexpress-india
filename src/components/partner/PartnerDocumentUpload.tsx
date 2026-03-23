'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface PartnerDocumentUploadProps {
    leadId: string;
}

export default function PartnerDocumentUpload({ leadId }: PartnerDocumentUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('File size exceeds 5MB limit');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            // Convert to Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Data = reader.result as string;

                const response = await fetch(`/api/partner/leads/${leadId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: file.name,
                        type: file.type.includes('pdf') ? 'PDF' : 'IMAGE',
                        data: base64Data
                    })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to upload');
                }

                if (fileInputRef.current) fileInputRef.current.value = '';
                router.refresh();
            };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Pick a smaller file or try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,image/*"
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-xl hover:bg-teal-100 transition-all disabled:opacity-50"
            >
                {isUploading ? '📤 Uploading...' : '📁 Upload Document'}
            </button>
            {error && (
                <p className="text-[10px] text-red-500 mt-1 font-bold">{error}</p>
            )}
        </div>
    );
}
