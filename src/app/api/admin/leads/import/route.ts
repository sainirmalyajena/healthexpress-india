import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/admin-auth';
import { LeadStatus } from '@/generated/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session || session.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { leads, assignedUserId } = body;

        if (!Array.isArray(leads)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        let importedCount = 0;

        for (const row of leads) {
            // Smart mapping for Meta Ads / Google Sheets columns
            const rawFullName = row.full_name || row.fullName || row['Full Name'] || row.Name;
            const rawPhone = row.phone || row.Phone || row['Phone Number'];
            
            if (!rawFullName || !rawPhone) continue;

            // Meta sometimes prepends 'p:' to phone numbers (e.g. 'p:+919867929432')
            const cleanPhone = String(rawPhone).replace(/^p:/i, '').trim();

            const rawCity = row.city || row.City || 'Unknown';
            const notesField = row['Notes '] || row.Notes || row.notes || '';
            const followUpsField = row['Follow ups'] || row['Follow up'] || '';
            const centrePref = row['which_centre_would_you_prefer?'] || '';
            const healthIns = row['do_you_have_health_insurance?'] || '';
            const platform = row.platform || '';
            
            let combinedDescription = row.description || 'Imported from CSV';
            if (notesField || followUpsField || centrePref || healthIns) {
                combinedDescription = `Imported from CSV.\n`;
                if (centrePref) combinedDescription += `Centre Preference: ${centrePref}\n`;
                if (healthIns) combinedDescription += `Health Insurance: ${healthIns}\n`;
                if (platform) combinedDescription += `Platform: ${platform}\n`;
                if (followUpsField) combinedDescription += `Follow ups: ${followUpsField}\n`;
                if (notesField) combinedDescription += `Notes: ${notesField}`;
            }

            // Parse created_time if available
            let createdAtDate = undefined;
            if (row.created_time || row.Date) {
                const parsedDate = new Date(row.created_time || row.Date);
                if (!isNaN(parsedDate.getTime())) {
                    createdAtDate = parsedDate;
                }
            }

            await prisma.lead.create({
                data: {
                    fullName: rawFullName,
                    phone: cleanPhone,
                    email: row.email || null,
                    city: rawCity,
                    description: combinedDescription.trim(),
                    status: LeadStatus.NEW,
                    sourcePage: 'CSV Import',
                    utmSource: platform || 'csv_upload',
                    utmCampaign: row.campaign_name || null,
                    referenceId: 'CSV-' + Date.now() + '-' + Math.floor(Math.random() * 10000),
                    assignedUserId: assignedUserId || null,
                    ...(createdAtDate && { createdAt: createdAtDate })
                }
            });
            importedCount++;
        }

        return NextResponse.json({ success: true, count: importedCount });
    } catch (error: any) {
        console.error('CSV Import Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
