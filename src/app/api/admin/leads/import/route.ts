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

        // Collect all clean phones from the CSV
        const validLeadsData = [];
        for (const row of leads) {
            const rawFullName = row.full_name || row.fullName || row['Full Name'] || row.Name;
            const rawPhone = row.phone || row.Phone || row['Phone Number'];
            if (!rawFullName || !rawPhone) continue;

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

            let createdAtDate = undefined;
            let rawDate = row.created_time || row.Date || row.created_at || row.createdAt || row.Timestamp || row['Created At'] || row['Date Created'] || row['Submission Date'] || row['date'] || row['time'];
            
            if (!rawDate) {
                const possibleKeys = Object.keys(row).filter(k => {
                    const kl = k.toLowerCase();
                    return kl.includes('date') || kl.includes('time') || kl.includes('created') || kl.includes('submitted');
                });
                if (possibleKeys.length > 0) {
                    rawDate = row[possibleKeys[0]];
                }
            }
            
            if (rawDate) {
                let parsedDate = new Date(rawDate);
                if (isNaN(parsedDate.getTime()) && typeof rawDate === 'string') {
                    let cleanStr = rawDate.trim().replace(' ', 'T');
                    parsedDate = new Date(cleanStr);
                    if (isNaN(parsedDate.getTime())) {
                        const parts = rawDate.split(/[\s/:-]/);
                        if (parts.length >= 3) {
                            const p0 = parseInt(parts[0], 10);
                            const p1 = parseInt(parts[1], 10);
                            const p2 = parseInt(parts[2], 10);
                            if (p2 > 2000) {
                                const m = p1 > 12 ? p0 : p1;
                                const d = p1 > 12 ? p1 : p0;
                                parsedDate = new Date(`${p2}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}T${parts[3] || '00'}:${parts[4] || '00'}:00`);
                            }
                        }
                    }
                }
                if (!isNaN(parsedDate.getTime())) {
                    createdAtDate = parsedDate;
                }
            }

            validLeadsData.push({
                fullName: rawFullName,
                phone: cleanPhone,
                email: row.email || null,
                city: rawCity,
                description: combinedDescription.trim(),
                status: LeadStatus.NEW,
                sourcePage: 'CSV Import',
                utmSource: platform || 'csv_upload',
                utmCampaign: row.campaign_name || null,
                referenceId: 'CSV-' + Date.now() + '-' + Math.floor(Math.random() * 10000) + '-' + validLeadsData.length,
                assignedUserId: assignedUserId || null,
                ...(createdAtDate && { createdAt: createdAtDate })
            });
        }

        // Fetch existing phones in one query to avoid sequential reads
        const phonesToCheck = validLeadsData.map(l => l.phone);
        const existingRecords = await prisma.lead.findMany({
            where: { phone: { in: phonesToCheck } },
            select: { phone: true }
        });
        const existingPhonesSet = new Set(existingRecords.map(r => r.phone));

        // Filter out duplicates
        const leadsToCreate = validLeadsData.filter(l => !existingPhonesSet.has(l.phone));

        if (leadsToCreate.length > 0) {
            // Bulk insert
            const createResult = await prisma.lead.createMany({
                data: leadsToCreate,
                skipDuplicates: true
            });
            importedCount = createResult.count;
        }

        return NextResponse.json({ success: true, count: importedCount });
    } catch (error: any) {
        console.error('CSV Import Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
