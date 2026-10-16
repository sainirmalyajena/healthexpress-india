const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/CaseManagerModal.tsx', 'utf8');

const needle = `            if (response.ok) {
                // Close immediately — don't wait for router.refresh() which causes 3-5 min delay.
                // Instead, set a success flag and let the page refresh silently in background.
                onClose();`;

const replacement = `            if (response.ok) {
                if (onUpdate) {
                    const chosenHospital = hospitals.find(h => h.id === hospitalId);
                    const chosenUser = teamMembers.find(t => t.id === assignedUserId);
                    onUpdate(lead.id, {
                        fullName,
                        city: city.trim(),
                        status,
                        hospitalId: hospitalId || null,
                        hospital: chosenHospital ? { name: chosenHospital.name, address: chosenHospital.address, googleMapsUrl: chosenHospital.googleMapsUrl } : lead.hospital,
                        assignedUserId: assignedUserId || null,
                        assignedUser: chosenUser ? { name: chosenUser.name } : lead.assignedUser,
                        originalCost: Number(originalCost),
                        isEmergency,
                        hasCard,
                        notes,
                        opdDate: opdDate ? new Date(opdDate).toISOString() : null,
                        ipdDate: ipdDate ? new Date(ipdDate).toISOString() : null,
                        followUpDate: followUpDate ? new Date(followUpDate).toISOString() : null,
                    });
                }
                onClose();`;

const normalizedCode = code.replace(/\r\n/g, '\n');
const normalizedNeedle = needle.replace(/\r\n/g, '\n');
const normalizedReplacement = replacement.replace(/\r\n/g, '\n');

if (normalizedCode.includes(normalizedNeedle)) {
    const updated = normalizedCode.replace(normalizedNeedle, normalizedReplacement);
    fs.writeFileSync('src/components/dashboard/CaseManagerModal.tsx', updated, 'utf8');
    console.log('✅ CaseManagerModal updated successfully!');
} else {
    console.error('Needle not found in CaseManagerModal');
}
