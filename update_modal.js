const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/CaseManagerModal.tsx', 'utf8');

// 1. Add validation logic inside handleSave
const handleSaveStart = `const handleSave = async () => {`;
const validationCode = `const handleSave = async () => {
        const noFollowUpNeeded = ['NEW', 'LOST', 'CLOSED'].includes(status);
        if (!noFollowUpNeeded && !followUpDate) {
            setError('A Follow-up Date and Time is mandatory when status is ' + status.replace('_', ' ') + '.');
            return;
        }

        setSaving(true);
        setError('');`;

content = content.replace(`const handleSave = async () => {\n        setSaving(true);\n        setError('');`, validationCode);

// 2. Add asterisk to label
const followUpLabel = `<label className="block text-sm font-bold text-slate-700 mb-1">Follow-up Date</label>`;
const newFollowUpLabel = `<label className="block text-sm font-bold text-slate-700 mb-1">Follow-up Date {!['NEW', 'LOST', 'CLOSED'].includes(status) && <span className="text-red-500">*</span>}</label>`;

content = content.replace(followUpLabel, newFollowUpLabel);

fs.writeFileSync('src/components/dashboard/CaseManagerModal.tsx', content);
