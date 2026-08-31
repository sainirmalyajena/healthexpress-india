'use client';
import { useState } from 'react';
import { Upload, Users } from 'lucide-react';
import Papa from 'papaparse';

export function CSVUploader({ teamMembers }: { teamMembers: any[] }) {
    const [file, setFile] = useState<File | null>(null);
    const [assigneeId, setAssigneeId] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setMessage('');

        // Read file text to handle Meta Ads CSVs where header is sometimes on the 2nd line
        const text = await file.text();
        let lines = text.split('\n');
        
        // Check if first line lacks standard headers but second line has them
        const firstLine = lines[0].toLowerCase();
        if (lines.length > 1 && !firstLine.includes('name') && !firstLine.includes('phone') && !firstLine.includes('email')) {
            const secondLine = lines[1].toLowerCase();
            if (secondLine.includes('name') || secondLine.includes('phone')) {
                // Remove the first line
                lines.shift();
            }
        }
        
        const correctedText = lines.join('\n');

        Papa.parse(correctedText, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const response = await fetch('/api/admin/leads/import', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            leads: results.data,
                            assignedUserId: assigneeId || null
                        })
                    });
                    
                    const data = await response.json();
                    if (data.success) {
                        setMessage('Successfully imported ' + data.count + ' leads.');
                        setFile(null);
                        window.location.reload();
                    } else {
                        setMessage(data.error || 'Upload failed');
                    }
                } catch (e) {
                    setMessage('Error uploading');
                }
                setUploading(false);
            }
        });
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
                <p className={\mt-4 text-sm font-bold \\}>
                    {message}
                </p>
            )}
        </div>
    );
}
