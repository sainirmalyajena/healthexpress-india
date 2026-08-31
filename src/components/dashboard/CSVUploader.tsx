'use client';
import { useState } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';

/**
 * Smart CSV Uploader for HealthExpress CRM
 * 
 * Handles Meta Ads CSV exports which have a non-standard format:
 * - Line 1: First data row + trailing header names (starts with "l:" lead ID)
 * - Line 2: A header row (but column order doesn't match data rows!)
 * - Lines 3+: Data rows in the SAME positional format as line 1
 * 
 * Positional mapping for Meta Ads CSVs:
 *   [0] lead_id, [1] created_time, [2-9] ad metadata,
 *   [10] is_organic, [11] platform, [12] centre_pref, [13] insurance,
 *   [14] full_name, [15] phone, [16] city, [17] lead_status,
 *   [18] follow_ups, [19] notes
 */
export function CSVUploader({ teamMembers }: { teamMembers: any[] }) {
    const [file, setFile] = useState<File | null>(null);
    const [assigneeId, setAssigneeId] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const parseMetaAdsCsv = (text: string): Record<string, string>[] => {
        const results = Papa.parse(text, {
            header: false,
            skipEmptyLines: true,
        });

        const rows = results.data as string[][];
        const leads: Record<string, string>[] = [];

        for (const row of rows) {
            // Skip rows that are headers or too short
            if (row.length < 17) continue;

            const firstCell = (row[0] || '').trim();

            // Skip header-like rows (line 2 starts with "platform", "ad_id", etc.)
            if (
                firstCell.toLowerCase() === 'platform' ||
                firstCell.toLowerCase() === 'ad_id' ||
                firstCell.toLowerCase() === 'full_name' ||
                firstCell.toLowerCase() === 'id'
            ) {
                continue;
            }

            // Data rows start with "l:" (Meta lead ID)
            // Positional extraction
            const fullName = (row[14] || '').trim();
            const phone = (row[15] || '').trim();
            const city = (row[16] || '').trim();

            if (!fullName || !phone) continue;

            leads.push({
                full_name: fullName,
                phone: phone,
                city: city,
                created_time: (row[1] || '').trim(),
                platform: (row[11] || '').trim(),
                'which_centre_would_you_prefer?': (row[12] || '').trim(),
                'do_you_have_health_insurance?': (row[13] || '').trim(),
                lead_status: (row[17] || '').trim(),
                'Follow ups': (row[18] || '').trim(),
                'Notes ': (row[19] || '').trim(),
                ad_name: (row[3] || '').trim(),
                campaign_name: (row[7] || '').trim(),
                form_name: (row[9] || '').trim(),
            });
        }

        return leads;
    };

    const isMetaAdsCsv = (text: string): boolean => {
        const firstLine = text.split('\n')[0] || '';
        return firstLine.trimStart().startsWith('l:');
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setMessage('');

        try {
            const text = await file.text();
            let parsedLeads: Record<string, string>[];

            if (isMetaAdsCsv(text)) {
                // Meta Ads format: positional parsing
                parsedLeads = parseMetaAdsCsv(text);
            } else {
                // Standard CSV with proper headers
                const result = Papa.parse(text, { header: true, skipEmptyLines: true });
                parsedLeads = result.data as Record<string, string>[];
            }

            if (parsedLeads.length === 0) {
                setMessage('No valid leads found in the CSV. Check the file format.');
                setUploading(false);
                return;
            }

            const response = await fetch('/api/admin/leads/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leads: parsedLeads,
                    assignedUserId: assigneeId || null
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage(`Successfully imported ${data.count} leads!`);
                setFile(null);
                setTimeout(() => window.location.reload(), 1000);
            } else {
                setMessage(data.error || 'Upload failed. Check server logs.');
            }
        } catch (e) {
            console.error('CSV Upload Error:', e);
            setMessage('Error uploading CSV file.');
        }
        setUploading(false);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Import Leads from CSV</h3>
            <div className="flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select CSV File</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Team Member</label>
                    <select
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value)}
                        className="block w-64 rounded-md border border-slate-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                    >
                        <option value="">-- Unassigned --</option>
                        {teamMembers.map(tm => (
                            <option key={tm.id} value={tm.id}>{tm.name} ({tm.email})</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-all"
                >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload CSV'}
                </button>
            </div>
            {message && (
                <p className={`mt-4 text-sm font-bold ${message.includes('Error') || message.includes('failed') || message.includes('No valid') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}
