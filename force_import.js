require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const rawData = `l:2179829392747654	2026-09-11T14:01:50-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	fb	kalyan	no	yes	Ajay Sane	p:+918857076708	Nagapur
l:1743023816905627	2026-09-11T13:09:36-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	fb	jogeshwari	yes	yes	Md Sahadat	p:+919974206283	dalkhola
l:1564914012047349	2026-09-11T11:57:07-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	fb	ghatkopar	no	yes	Zuhair Jamei	p:+919892923184	Mumbai
l:1620225356502201	2026-09-11T09:46:42-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	ig	vashi,_navi_mumbai	yes	yes	Mr. Deepak padwal	p:+918446929395	Khopoli
l:2458821564857131	2026-09-11T09:26:53-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	fb	jogeshwari	no	no	Saddam Hassan	p:+917058298682	Watodha Shukleshwar Ilyas Nagar
l:1070146139099570	2026-09-11T09:14:03-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	ig	kalyan	yes	yes	Brijesh Parmar	p:+917738711866	Vadodara
l:1727176151911335	2026-09-11T08:53:11-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	fb	delhi	yes	no	Dev Garment	p:+919312122018	delhi
l:960561386334038	2026-09-11T07:52:35-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	fb	vashi,_navi_mumbai	yes	yes	Rajesh Vaity	p:+918454944180	Navi Mumbai (New Mumbai)
l:1094697469565932	2026-09-11T07:23:02-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	ig	ghatkopar	no	no	Vivek	p:+919221116599	
l:3268099756722712	2026-09-11T03:37:07-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	ig	delhi	no	yes	Sahil Khan	p:+917703871974	Delhi
l:4295887173888817	2026-09-11T02:10:33-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	fb	delhi	no	yes	Ganga Gupta	p:+17017006572	Delhi shahdara
l:1761471018469958	2026-09-11T00:39:00-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	fb	kalyan	yes	yes	Ajay Vijay Dive	p:+919594297569	Kalyan
l:1087288837116479	2026-09-11T00:21:39-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	fb	ghatkopar	yes	yes	Gajendra Deora Khiwandi	p:+919588861184	Mumbai
l:1053516657722936	2026-09-10T19:36:07-07:00	ag:52524681724174	New Engagement Ad	as:52524681723774	New Engagement Ad Set	c:52524681723974	New Campaign Video	f:1010420755350301	LASIK Special Offer – Consultation new-copy	FALSE	ig	kalyan	no	no	RakeshPrajapati	p:+917276896817	`;

async function forceImport() {
    try {
        const lines = rawData.trim().split('\n');
        let newCount = 0;
        let updateCount = 0;
        
        for (const line of lines) {
            const parts = line.split('\t');
            if (parts.length < 16) continue;
            
            const rawDate = parts[1];
            const rawName = parts[15];
            const rawPhone = parts[16];
            const rawCity = parts[17] || '';
            const centre = parts[12];
            const hasInsurance = parts[13];
            const lookingForLasik = parts[14];
            
            let phone = rawPhone.replace(/[^0-9]/g, '');
            if (phone.length > 10 && phone.startsWith('91')) {
                phone = phone.substring(2);
            }
            if (!phone) continue;
            
            const date = new Date(rawDate);
            
            const notes = `Centre Preference: ${centre}\nHas Health Insurance: ${hasInsurance}\nLooking for LASIK: ${lookingForLasik}`;
            
            const existing = await prisma.lead.findFirst({ where: { phone } });
            if (existing) {
                await prisma.lead.update({
                    where: { id: existing.id },
                    data: {
                        createdAt: date,
                        fullName: rawName,
                        city: rawCity,
                        notes: existing.notes ? `${existing.notes}\n\n${notes}` : notes
                    }
                });
                updateCount++;
            } else {
                await prisma.lead.create({
                    data: {
                        referenceId: Math.random().toString(36).substring(2, 8).toUpperCase(),
                        fullName: rawName,
                        phone,
                        city: rawCity,
                        createdAt: date,
                        status: 'NEW',
                        sourcePage: 'Manual Force Import',
                        description: '',
                        notes: notes
                    }
                });
                newCount++;
            }
        }
        
        console.log(`Force imported! New: ${newCount}, Updated: ${updateCount}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

forceImport();
