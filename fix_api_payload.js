const fs = require('fs');
let content = fs.readFileSync('src/app/api/dashboard/leads/[id]/route.ts', 'utf8');

const oldStr = `        const dataToUpdate: any = {
            ...(status && { status: status as LeadStatus }),
            hospitalId: hospitalId || null,
            originalCost: originalCost || null,
            discountedCost,
            revenue,
            isEmergency: isEmergency ?? false,
            hasCard: hasCard ?? false,
            notes: notes || null,
            opdDate: opdDate ? new Date(opdDate) : null,
            followUpDate: followUpDate ? new Date(followUpDate) : null,
            assignedUserId: assignedUserId || null
        };`;

const newStr = `        const dataToUpdate: any = {
            ...(status !== undefined && { status: status as LeadStatus }),
            ...(hospitalId !== undefined && { hospitalId: hospitalId || null }),
            ...(originalCost !== undefined && { originalCost: originalCost || null }),
            ...(discountedCost !== undefined && { discountedCost }),
            ...(revenue !== undefined && { revenue }),
            ...(isEmergency !== undefined && { isEmergency }),
            ...(hasCard !== undefined && { hasCard }),
            ...(notes !== undefined && { notes: notes || null }),
            ...(opdDate !== undefined && { opdDate: opdDate ? new Date(opdDate) : null }),
            ...(followUpDate !== undefined && { followUpDate: followUpDate ? new Date(followUpDate) : null }),
            ...(assignedUserId !== undefined && { assignedUserId: assignedUserId || null })
        };`;

content = content.replace(oldStr, newStr);

fs.writeFileSync('src/app/api/dashboard/leads/[id]/route.ts', content);
