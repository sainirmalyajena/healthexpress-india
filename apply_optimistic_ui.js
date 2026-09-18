const fs = require('fs');

// 1. UPDATE LeadStatusSelect.tsx
let statusContent = fs.readFileSync('src/components/dashboard/LeadStatusSelect.tsx', 'utf8');

// Add onUpdate to props
statusContent = statusContent.replace(
    /interface LeadStatusSelectProps {[\s\S]*?}/,
    `interface LeadStatusSelectProps {\n    leadId: string;\n    currentStatus: string;\n    onUpdate?: (newStatus: string) => void;\n}`
);

// Modify handleChange
statusContent = statusContent.replace(
    /const handleChange = async \(e: React\.ChangeEvent<HTMLSelectElement>\) => {[\s\S]*?};/m,
    `const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        if (onUpdate) onUpdate(newStatus);
        
        setIsUpdating(true);
        try {
            await fetch(\`/api/dashboard/leads/\${leadId}\`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };`
);
fs.writeFileSync('src/components/dashboard/LeadStatusSelect.tsx', statusContent);


// 2. UPDATE CaseManagerModal.tsx
let modalContent = fs.readFileSync('src/components/dashboard/CaseManagerModal.tsx', 'utf8');

// Add onUpdate to props
modalContent = modalContent.replace(
    /interface CaseManagerModalProps {/,
    `interface CaseManagerModalProps {\n    onUpdate?: (id: string, data: any) => void;`
);

// Modify handleSave
modalContent = modalContent.replace(
    /const handleSave = async \(\) => {[\s\S]*?if \(!response\.ok\) throw new Error\('Failed to update lead'\);[\s\S]*?onClose\(\);[\s\S]*?};/m,
    `const handleSave = async () => {
        // Optimistic Update
        if (onUpdate) {
            onUpdate(lead.id, {
                status,
                hospitalId: hospitalId || null,
                originalCost: Number(originalCost),
                isEmergency,
                hasCard,
                notes,
                opdDate: opdDate || null,
                followUpDate: followUpDate || null,
                assignedUserId: assignedUserId || null
            });
        }
        
        // Instantly close modal
        onClose();

        // Background sync
        try {
            fetch(\`/api/dashboard/leads/\${lead.id}\`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    hospitalId: hospitalId || null,
                    originalCost: Number(originalCost),
                    isEmergency,
                    hasCard,
                    notes,
                    opdDate: opdDate || null,
                    followUpDate: followUpDate || null,
                    assignedUserId: assignedUserId || null
                }),
            });
        } catch (error) {
            console.error('Background sync failed', error);
        }
    };`
);
fs.writeFileSync('src/components/dashboard/CaseManagerModal.tsx', modalContent);


// 3. UPDATE LeadsTable.tsx
let tableContent = fs.readFileSync('src/components/dashboard/LeadsTable.tsx', 'utf8');

// Add useEffect import if not there
if (!tableContent.includes('useEffect')) {
    tableContent = tableContent.replace(/import { useState } from 'react';/, `import { useState, useEffect } from 'react';`);
}

// Add local state
tableContent = tableContent.replace(
    /const \[selectedLead, setSelectedLead\] = useState<Lead \| null>\(null\);/,
    `const [localLeads, setLocalLeads] = useState<Lead[]>(leads);\n    useEffect(() => { setLocalLeads(leads); }, [leads]);\n\n    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);`
);

// Add handlers
const handlers = `
    const handleStatusUpdate = (id: string, newStatus: string) => {
        setLocalLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
    };

    const handleModalUpdate = (id: string, data: any) => {
        setLocalLeads(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
    };
`;
tableContent = tableContent.replace(
    /const handleSelectAll = \(e: React\.ChangeEvent<HTMLInputElement>\) => {/,
    handlers + '\n    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {'
);

// Replace uses of `leads` with `localLeads`
tableContent = tableContent.replace(/leads\.length === 0/g, 'localLeads.length === 0');
tableContent = tableContent.replace(/leads\.every\(/g, 'localLeads.every(');
tableContent = tableContent.replace(/leads\.filter\(/g, 'localLeads.filter(');
tableContent = tableContent.replace(/leads\.map\(/g, 'localLeads.map(');

// Update LeadStatusSelect props
tableContent = tableContent.replace(
    /<LeadStatusSelect\s+leadId=\{lead\.id\}\s+currentStatus=\{lead\.status\}\s*\/>/g,
    `<LeadStatusSelect leadId={lead.id} currentStatus={lead.status} onUpdate={(s) => handleStatusUpdate(lead.id, s)} />`
);

// Update CaseManagerModal props
tableContent = tableContent.replace(
    /<CaseManagerModal\s+lead=\{selectedLead\}\s+onClose=\{\(\) => setSelectedLead\(null\)\}\s+hospitals=\{hospitals\}\s+teamMembers=\{teamMembers\}\s*\/>/g,
    `<CaseManagerModal lead={selectedLead} onClose={() => setSelectedLead(null)} hospitals={hospitals} teamMembers={teamMembers} onUpdate={handleModalUpdate} />`
);

fs.writeFileSync('src/components/dashboard/LeadsTable.tsx', tableContent);
