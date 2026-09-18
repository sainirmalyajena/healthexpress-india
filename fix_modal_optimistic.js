const fs = require('fs');
let modalContent = fs.readFileSync('src/components/dashboard/CaseManagerModal.tsx', 'utf8');

modalContent = modalContent.replace(
    /const handleSave = async \(\) => \{[\s\S]*?catch \(err\) \{[\s\S]*?setError\('An error occurred'\);[\s\S]*?\} finally \{[\s\S]*?setSaving\(false\);[\s\S]*?\}[\s\S]*?\};/m,
    `const handleSave = () => {
        // Optimistic UI Update (0ms)
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
        
        // Immediately close modal
        onClose();

        // Fire and forget background sync
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
        }).then(() => {
            // Silently refresh server cache
            startTransition(() => {
                router.refresh();
            });
        }).catch(err => {
            console.error("Background sync failed", err);
        });
    };`
);

fs.writeFileSync('src/components/dashboard/CaseManagerModal.tsx', modalContent);
