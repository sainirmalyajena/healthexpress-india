const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();
async function insert() {
    const adminId = 'cmt1dfhbz0000wgnskg4mru6x';
    const baseLead = {
        status: 'NEW',
        sourcePage: 'CSV Import (Manual)',
        assignedUserId: adminId
    };

    const leads = [
        { ...baseLead, fullName: 'Vikash Kumar', phone: '7033715086', city: 'Narkatiaganj', description: 'Imported from CSV.\nCentre Preference: kalyan\nHealth Insurance: yes\nLASIK Interest: yes\nPlatform: fb\nCampaign: New Campaign Video', referenceId: 'CSV-MANUAL-1' },
        { ...baseLead, fullName: 'Aman', phone: '9096331480', city: 'Aurngabad', description: 'Imported from CSV.\nCentre Preference: kalyan\nHealth Insurance: yes\nLASIK Interest: yes\nPlatform: ig', referenceId: 'CSV-MANUAL-2' },
        { ...baseLead, fullName: 'Hard Wark Karpentar', phone: '9540279527', city: 'Delhi', description: 'Imported from CSV.\nCentre Preference: delhi\nHealth Insurance: yes\nLASIK Interest: yes\nPlatform: ig', referenceId: 'CSV-MANUAL-3' },
        { ...baseLead, fullName: 'Imtiyaz shaikh', phone: '9819285920', city: 'Mumbai', description: 'Imported from CSV.\nCentre Preference: ghatkopar\nHealth Insurance: no\nLASIK Interest: yes\nPlatform: fb', referenceId: 'CSV-MANUAL-4' }
    ];

    try {
        await prisma.lead.createMany({ data: leads });
        console.log('Inserted 4 leads successfully!');
    } catch(e) {
        console.error(e);
    }
}
insert();
