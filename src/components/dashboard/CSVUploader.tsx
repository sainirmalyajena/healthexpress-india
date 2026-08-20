" use client\;
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

 Papa.parse(file, {
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
 setMessage(Successfully imported leads.);
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
 <div className=\bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8\>
 <h3 className=\text-lg font-semibold text-slate-900 mb-4\>Import Leads from CSV</h3>
 <div className=\flex flex-wrap gap-4 items-end\>
 <div>
 <label className=\block text-sm font-medium text-slate-700 mb-1\>Select CSV File</label>
 <input 
 type=\file\ 
 accept=\.csv\ 
 onChange={(e) => setFile(e.target.files?.[0] || null)}
 className=\block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100\
 />
 </div>
 <div>
 <label className=\block text-sm font-medium text-slate-700 mb-1\>Assign to Team Member</label>
 <select 
 value={assigneeId} 
 onChange={(e) => setAssigneeId(e.target.value)}
 className=\block w-64 rounded-md border border-slate-300 py-2 pl-3 pr-10 text-base focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm\
 >
 <option value=\\>-- Unassigned --</option>
 {teamMembers.map(tm => (
 <option key={tm.id} value={tm.id}>{tm.name} ({tm.email})</option>
 ))}
 </select>
 </div>
 <button 
 onClick={handleUpload}
 disabled={!file || uploading}
 className=\bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2\
 >
 <Upload className=\w-4 h-4\ />
 {uploading ? 'Importing...' : 'Upload CSV'}
 </button>
 </div>
 {message && <p className=\mt-3 text-sm text-emerald-600 font-medium\>{message}</p>}
 </div>
 );
}
