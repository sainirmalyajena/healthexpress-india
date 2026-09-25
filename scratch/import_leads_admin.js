const fs = require('fs');
const Papa = require('papaparse');
const { PrismaClient } = require('./src/generated/prisma');

const prisma = new PrismaClient();

const csvData = `id,created_time,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,form_name,is_organic,platform,which_centre_would_you_prefer?,do_you_have_health_insurance?,are_you_looking_for_lasik_surgery,full_name,phone_number,city
l:1062269359945847,2026-09-23T17:04:53+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,delhi,yes,yes,Sameer Mkm Mkm,p:+918119944494,thoubal
l:1557894928956183,2026-09-23T17:04:12+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,jogeshwari,no,yes,yogita,p:+918698866742,Mumbai
l:1139717075384621,2026-09-23T16:46:17+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,ghatkopar,no,no,Vaibhav Adhave,p:+917208357926,Mumbai Suburban
l:1597328768725368,2026-09-23T15:52:19+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,kalyan,yes,yes,Suraj Bharti,p:+917275857213,
l:1396243622635462,2026-09-23T15:02:56+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,"vashi,_navi_mumbai",no,yes,Gorakh Unde,p:+917038234140,Ahmednagar
l:1511374244154107,2026-09-23T14:07:07+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,ghatkopar,no,yes,निलेश कदम,p:+919152434265,Mumbai
l:1379090313937127,2026-09-23T13:40:09+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,jogeshwari,yes,yes,Waseem Lone,p:+917006730920,34
l:4407720562816112,2026-09-23T13:29:20+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,delhi,yes,yes,Marco Marco,p:+919044520024,Palamau
l:4114605388839168,2026-09-23T13:09:28+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,jogeshwari,no,yes,shipra,p:+917304775024,Mumbai
l:4514475798880701,2026-09-23T12:47:37+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,kalyan,yes,no,Soumya,p:+918452876040,Kalyan
l:2755557648192390,2026-09-23T12:30:20+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,"vashi,_navi_mumbai",yes,yes,Bhaskar Koli,p:+919821742779,वाशी नवी मुंबई
l:2648527775574743,2026-09-23T11:54:13+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,kalyan,yes,yes,Namrata patil,p:+919096276325,Dombivli
l:1404086811219522,2026-09-23T11:05:23+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,jogeshwari,no,yes,Deepak Devadkar,p:+919987374234,"mumbai,goregaon east"
l:2309819423185835,2026-09-23T10:55:28+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,"vashi,_navi_mumbai",no,yes,Suresh Patil,p:+919326875911,Pune
l:1781616146204469,2026-09-23T10:51:30+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,"vashi,_navi_mumbai",yes,yes,amin__pathan__y43,p:+919594757886,Mumbai
l:1884290396277850,2026-09-23T10:48:31+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,jogeshwari,no,yes,Saniya khan,p:+917304882824,Mumbai
l:2144811276471145,2026-09-23T10:45:20+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,jogeshwari,no,no,naman Viswakrma,p:+918108977520,bombay
l:1018268124563950,2026-09-23T08:29:44+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,jogeshwari,yes,yes,Rahim Laluwale,p:+18308522790,431513
l:1727164071674756,2026-09-23T03:24:19+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,jogeshwari,yes,yes,Deepika Khatoon874,p:8744975804,8744975804
l:1723213788760199,2026-09-23T02:48:06+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,kalyan,yes,yes,Sachin Jadhav,p:+917798194252,ulhasnagar
l:2098653014079108,2026-09-23T02:27:24+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,kalyan,yes,yes,Hayat Relaxation,p:+917798770034,Ulhasnagar
l:1064000906465447,2026-09-23T01:08:28+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,jogeshwari,no,yes,Ali Khandakar,p:+917908445422,Mumbai
l:1441676554725857,2026-09-23T00:23:43+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,kalyan,yes,yes,Gaurav jadhav,p:+918237944980,Nashik
l:1406821338229505,2026-09-23T00:19:58+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,kalyan,yes,yes,vikram,p:+919341049406,
l:1627443115705907,2026-09-19T12:53:15+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,kalyan,no,no,Simran mirchandani,p:+919082871836,Ulhasnagar 1
l:3179795328871607,2026-09-19T00:39:34+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,jogeshwari,yes,yes,Dev Kumar,p:+919892770957,Mumbai
l:2060402954838638,2026-09-19T00:17:03+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,jogeshwari,yes,yes,Piyush Mishra,p:+917710986314,Mumbai
l:4617668448455829,2026-09-18T23:39:14+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,delhi,yes,yes,Jitender Kumar,p:+919811542083,delhi
l:4537447413164349,2026-09-18T23:29:46+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,ghatkopar,yes,yes,mohd jabir,p:+919795228577,Uttar Pradesh
l:1903423634374754,2026-09-18T22:30:10+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,jogeshwari,yes,yes,Mohd Ismail,p:+919803048262,
l:1442547617729908,2026-09-18T22:02:40+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,kalyan,no,yes,Ratan Kalu Bagul,p:+19168112245,nandurbar
l:1659105948965341,2026-09-18T19:48:36+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,kalyan,no,no,Avinash Jagatkar,p:+17057955777,gangakhed
l:4967806660112835,2026-09-18T19:28:24+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,jogeshwari,no,yes,sandeep  Anavkar,p:+919619110067,Mumbai
l:992688103835649,2026-09-18T19:09:49+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,jogeshwari,no,no,Vinod Berde,p:+918452959592,Mumbai
l:1065978566320291,2026-09-18T18:54:11+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,ghatkopar,no,yes,santosh pethe,p:+918104142250,Mumbai ghatkopar
l:1863690141476359,2026-09-18T18:42:38+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,"vashi,_navi_mumbai",no,no,Jitendra Yadav,p:+919930808323,Mumbai
l:1073471678902134,2026-09-18T17:51:40+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,delhi,yes,yes,Radhe Pataura,p:+918827211290,
l:2722210081529004,2026-09-18T17:13:42+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,"vashi,_navi_mumbai",no,yes,Prasad Sondkar,p:+919370002075,Pune
l:3589596094533105,2026-09-18T15:31:18+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,kalyan,yes,yes,Vikash Kumar,p:+917033715086,Narkatiaganjnarkatiaganj
l:2044066107005338,2026-09-18T15:11:27+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,kalyan,yes,yes,Aman,p:+919096331480,Aurngabad
l:1068269905807047,2026-09-18T14:47:27+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,ig,delhi,yes,yes,Hard Wark Karpentar,p:+919540279527,Delhi
l:1769689067513349,2026-09-18T14:44:41+05:30,ag:52524681724174,New Engagement Ad,as:52524681723774,New Engagement Ad Set,c:52524681723974,New Campaign Video,f:1010420755350301,LASIK Special Offer – Consultation new-copy,false,fb,ghatkopar,no,yes,Imtiyaz shaikh,p:+919819285920,Mumbai`;

function cleanPhoneNumber(raw) {
    if (!raw) return '';
    return raw.replace(/^p:/i, '').trim();
}

function get10Digit(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.slice(-10);
}

function formatCity(city, centre) {
    if (city && city.trim() && city.trim().length > 1 && !/^\d+$/.test(city.trim())) {
        return city.trim();
    }
    if (centre && centre.trim()) {
        let c = centre.replace(/_/g, ' ').replace(/,/g, ', ').trim();
        return c.charAt(0).toUpperCase() + c.slice(1);
    }
    return 'Mumbai';
}

function parseInsurance(val) {
    if (!val) return 'NOT_SURE';
    const lower = val.toLowerCase().trim();
    if (lower === 'yes') return 'YES';
    if (lower === 'no') return 'NO';
    return 'NOT_SURE';
}

async function run() {
    const admin = await prisma.user.findFirst({
        where: { role: 'admin' },
        select: { id: true, name: true, email: true }
    });

    const adminId = admin ? admin.id : null;
    const adminName = admin ? admin.name : 'Admin User';
    const adminEmail = admin ? admin.email : 'admin@healthexpress.in';
    console.log(`Assigning leads to Admin: ${adminName} (${adminEmail}, ID: ${adminId})`);

    const lasikSurgery = await prisma.surgery.findFirst({
        where: { name: { contains: 'LASIK', mode: 'insensitive' } },
        select: { id: true, name: true }
    });
    console.log(`Matched Surgery: ${lasikSurgery?.name} (ID: ${lasikSurgery?.id})`);

    const parsed = Papa.parse(csvData.trim(), {
        header: true,
        skipEmptyLines: true
    });

    console.log(`Total rows in CSV: ${parsed.data.length}`);

    // Pre-fetch all existing leads to check for duplicates
    const existingLeads = await prisma.lead.findMany({
        select: { id: true, phone: true, fullName: true, referenceId: true }
    });

    const existingPhonesSet = new Set();
    for (const l of existingLeads) {
        const last10 = get10Digit(l.phone);
        if (last10) existingPhonesSet.add(last10);
    }

    const seenInThisBatch = new Set();

    let createdCount = 0;
    let skippedDuplicateCount = 0;
    const createdList = [];
    const skippedList = [];

    for (const row of parsed.data) {
        const rawPhone = row.phone_number;
        const cleanedPhone = cleanPhoneNumber(rawPhone);
        const last10 = get10Digit(cleanedPhone);
        const name = (row.full_name || 'Patient').trim();

        if (!last10 || last10.length < 10) {
            console.warn(`Invalid phone number for row: ${name}, ${rawPhone}`);
            continue;
        }

        // Duplicate check
        if (existingPhonesSet.has(last10) || seenInThisBatch.has(last10)) {
            skippedDuplicateCount++;
            skippedList.push({ name, phone: cleanedPhone, reason: 'Duplicate Phone Number' });
            console.log(`[SKIP DUPLICATE] ${name} (${cleanedPhone})`);
            continue;
        }

        seenInThisBatch.add(last10);
        existingPhonesSet.add(last10);

        const centre = row['which_centre_would_you_prefer?'] || '';
        const insuranceAns = row['do_you_have_health_insurance?'] || '';
        const lasikAns = row['are_you_looking_for_lasik_surgery'] || '';
        const city = formatCity(row.city, centre);
        const insurance = parseInsurance(insuranceAns);

        const notes = [
            `[Meta Ads Import]`,
            `Assigned To: ${adminName} (${adminEmail})`,
            `Platform: ${(row.platform || '').toUpperCase()}`,
            `Form: ${row.form_name || ''}`,
            `Campaign: ${row.campaign_name || ''}`,
            `Ad Name: ${row.ad_name || ''}`,
            `Preferred Centre: ${centre.replace(/_/g, ' ')}`,
            `Looking for LASIK: ${lasikAns}`,
            `Has Insurance: ${insuranceAns}`,
            row.city ? `Lead Provided City: ${row.city}` : ''
        ].filter(Boolean).join('\n');

        const referenceId = `HE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        let createdAt = new Date();
        if (row.created_time) {
            const parsedDate = new Date(row.created_time);
            if (!isNaN(parsedDate.getTime())) {
                createdAt = parsedDate;
            }
        }

        const newLead = await prisma.lead.create({
            data: {
                referenceId,
                fullName: name,
                phone: cleanedPhone,
                city: city,
                surgeryId: lasikSurgery ? lasikSurgery.id : null,
                assignedUserId: adminId,
                description: `Meta Ad Lead (Assigned to: ${adminName}) - LASIK inquiry from ${(row.platform || 'meta').toUpperCase()}`,
                insurance: insurance,
                status: 'NEW',
                notes: notes,
                sourcePage: 'Meta Ads',
                utmSource: row.platform || 'meta',
                utmCampaign: row.campaign_name || null,
                utmContent: row.ad_name || null,
                utmMedium: 'cpc',
                createdAt: createdAt
            }
        });

        createdCount++;
        createdList.push({
            name: newLead.fullName,
            phone: newLead.phone,
            city: newLead.city,
            refId: newLead.referenceId
        });
        console.log(`[CREATED #${createdCount}] ${newLead.fullName} (${newLead.phone}) - Ref: ${newLead.referenceId}`);
    }

    console.log(`\n========================================`);
    console.log(`IMPORT SUMMARY:`);
    console.log(`Total rows in file:   ${parsed.data.length}`);
    console.log(`Successfully created: ${createdCount}`);
    console.log(`Duplicates skipped:   ${skippedDuplicateCount}`);
    console.log(`========================================\n`);

    return { createdCount, skippedDuplicateCount, createdList, skippedList };
}

run()
    .then(res => {
        fs.writeFileSync('import_results.json', JSON.stringify(res, null, 2));
    })
    .catch(err => {
        console.error("Import failed with error:", err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
