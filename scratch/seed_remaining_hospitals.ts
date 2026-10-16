import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const REMAINING_HOSPITALS = [
    {
        id: 'cmu5qehva0001wghwnxfmuv48', // ASG Drishti Eye Hospital - Mulund
        name: 'ASG Drishti Eye Hospital - Mulund',
        pincode: '400080',
        latitude: 19.1726,
        longitude: 72.9565,
        address: 'Devidayal Road, Next to P&T Colony, Mulund West, Mumbai, Maharashtra 400080'
    },
    {
        id: 'cmu5qeqjf0007wghw48nmbsyk', // Gadgil Eye Hospital - Thane
        name: 'Gadgil Eye Hospital - Thane',
        pincode: '400602',
        latitude: 19.1860,
        longitude: 72.9759,
        address: '1st Floor, Paradise Tower, Next to McDonald\'s, Gokhale Road, Naupada, Thane (West), Maharashtra 400602'
    },
    {
        id: 'cmu5qesqt0009wghwv9xmgi8t', // ASG Garg Ophthalmic Centre - Lucknow
        name: 'ASG Garg Ophthalmic Centre - Lucknow',
        pincode: '226010',
        latitude: 26.8489,
        longitude: 80.9982,
        address: '1/13, Vipul Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010'
    },
    {
        id: 'cmu5qevsx000bwghwm07kw2zc', // ASG Eye Hospital - C Scheme, Jaipur
        name: 'ASG Eye Hospital - C Scheme, Jaipur',
        pincode: '302001',
        latitude: 26.9124,
        longitude: 75.8048,
        address: 'Plot No. 1, Ground Floor, Ashok Marg, C Scheme, Ashok Nagar, Jaipur, Rajasthan 302001'
    },
    {
        id: 'cmustpudt0000ifh0tn3nfpte', // Eye Veda Hospital - Defence Colony
        name: 'Eye Veda Hospital - Defence Colony',
        pincode: '110024',
        latitude: 28.5729,
        longitude: 77.2323,
        address: 'GF, E5, Block E, Defence Colony, New Delhi, Delhi 110024'
    },
    {
        id: 'cmustpuve0003ifh0sqf02dn7', // Bharti Eye Hospital - Greater Kailash
        name: 'Bharti Eye Hospital - Greater Kailash',
        pincode: '110048',
        latitude: 28.5494,
        longitude: 77.2378,
        address: 'E-52, Block E, Greater Kailash I, Greater Kailash, New Delhi, Delhi 110048'
    },
    {
        id: 'cmustpv3t0006ifh08phnki3a', // The Sight Avenue Eye Hospital - Greater Kailash
        name: 'The Sight Avenue Eye Hospital - Greater Kailash',
        pincode: '110048',
        latitude: 28.5510,
        longitude: 77.2361,
        address: 'E-82-A, Ground Floor, Hansraj Gupta Rd, Greater Kailash I, New Delhi, Delhi 110048'
    },
    {
        id: 'cmustpvcq0009ifh0fmclkpiq', // The Sight Avenue Eye Hospital - Gurugram
        name: 'The Sight Avenue Eye Hospital - Gurugram',
        pincode: '122018',
        latitude: 28.4357,
        longitude: 77.0396,
        address: '243 P, Sector 38, near Bakhtawar Chowk, Gurugram, Haryana 122018'
    },
    {
        id: 'cmustpvl3000cifh0xl3n00q4', // Synergy Eye Care - Chittaranjan Park
        name: 'Synergy Eye Care - Chittaranjan Park',
        pincode: '110048',
        latitude: 28.5392,
        longitude: 77.2514,
        address: 'A-6, Block A, Chittaranjan Park, New Delhi, Delhi 110048'
    },
    {
        id: 'cmus3500q0002ifiof02f0a5p', // ASG Eye Hospital - Noida
        name: 'ASG Eye Hospital - Noida',
        pincode: '201301',
        latitude: 28.5762,
        longitude: 77.3670,
        address: 'B-1/17, Sector 50, Noida, Uttar Pradesh 201301'
    },
    {
        id: 'cmtifglg60003wg20e1i5h4py', // Sharp Sight Eye Hospital - Preet Vihar
        name: 'Sharp Sight Eye Hospital - Preet Vihar',
        pincode: '110092',
        latitude: 28.6384,
        longitude: 77.2941,
        address: 'A-15, Swasthya Vihar, Vikas Marg, Opp Metro Pillar 82, Preet Vihar, Delhi 110092'
    },
    {
        id: 'cmtifgkpk0002wg20huluww87', // ASG Eye Hospital - Dadar
        name: 'ASG Eye Hospital - Dadar',
        pincode: '400014',
        latitude: 19.0178,
        longitude: 72.8478,
        address: '155, Geetanjali Building, Sir Bhalachandra Road, Beside Ruia College, Dadar East, Mumbai, Maharashtra 400014'
    },
    {
        id: 'cmtifgj6c0000wg20y3f3hzl2', // Envision Eye Hospital - Jogeshwari
        name: 'Envision Eye Hospital - Jogeshwari',
        pincode: '400102',
        latitude: 19.1363,
        longitude: 72.8488,
        address: '5th Floor, Mallika Hospital, Sharma Estate, Next to Mina International Hotel, S.V. Road, Opposite Jogeshwari Railway Station (West), Mumbai, Maharashtra 400102'
    },
    {
        id: 'cmus398q70000ife045d5yk8c', // ASG Eye Hospital - Vashi
        name: 'ASG Eye Hospital - Vashi',
        pincode: '400703',
        latitude: 19.0760,
        longitude: 73.0031,
        address: '6th Floor, Goodwill Excellency, Plot No. 88, Sector 17, Vashi, Navi Mumbai, Maharashtra 400703'
    }
];

async function main() {
    for (const h of REMAINING_HOSPITALS) {
        await prisma.hospital.update({
            where: { id: h.id },
            data: {
                pincode: h.pincode,
                latitude: h.latitude,
                longitude: h.longitude,
                address: h.address
            }
        });
        console.log(`✅ Updated ${h.name} -> Pincode: ${h.pincode}`);
    }
    console.log('\nAll 14 remaining hospitals successfully updated!');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
