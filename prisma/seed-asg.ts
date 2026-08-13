import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

const asgHospitals = [
  { name: 'ASG Eye Hospital - Amritsar', city: 'Amritsar', address: 'Plot No 3, Mukut House, Mall Rd, opp. Company Bagh', email: 'amritsar@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Dombivli', city: 'Mumbai', address: 'Jaykul Arcade, Manpada Road, Opp. Indian bank', email: 'dombivli@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Vashi', city: 'Mumbai', address: '6th Floor, Plot No, Goodwill Excellency, 2, Sector 17', email: 'vashi@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Kalyan', city: 'Mumbai', address: '3rd Floor, Khadakpada Cir, Beturkar Pada', email: 'kalyan@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - B.T. Road', city: 'Kolkata', address: 'Ground and First Floor, 149, Barrackpore Trunk Rd, Kamarhati', email: 'kolkata@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Laketown', city: 'Kolkata', address: '403/1, Alcove Gloria, Above Big Bazaar, Dakshindari Road, VIP Rd', email: 'kolkata@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Tollygunge', city: 'Kolkata', address: '70/2, Deshpran Sasmal Rd, Tollygunge Phari', email: 'tollygunge@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Noida', city: 'Noida', address: 'V-21A, Indra Market Road, Near Vinayak Hospital, Sector-27', email: 'noida@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Kanpur', city: 'Kanpur', address: '122/726, Plot No. 302, Shastri Nagar Post Office Road', email: 'kanpur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Varanasi 1', city: 'Varanasi', address: 'Plot Number 141, Infront of Sant Kabir Math (Shri Kabir Prakatyasthali)', email: 'varanasiltr@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Varanasi 2', city: 'Varanasi', address: 'Ground Floor, Corporate Plaza, Near A.G.R Automobile, Rathyatra', email: 'mahmovaranasi@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Ujjain', city: 'Ujjain', address: 'D R PLAZA, 1st & 2nd floor, Sanwer Rd, near Punjab National Bank', email: 'ujjain@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Udaipur', city: 'Udaipur', address: '7C-2, Meera Marg, Near Mira Girls College, Madhuban', email: 'udaipur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Surat', city: 'Surat', address: 'Plot No 1 & 2 Jash Bryant, opp. RTO, beside Vanita Vishram Ground', email: 'surat@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Srinagar', city: 'Srinagar', address: 'Bagh-I-Nund Singh Chattabal, opposite Tatoo Ground, near Petrol Pump', email: 'srinagar@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Siliguri', city: 'Siliguri', address: 'Pranami Mandir Rd, opp. Kejriwal Stone & Kidney Clinic, Ward 40', email: 'siliguri@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Sehore', city: 'Sehore', address: 'Plot No. 33, 38/3, 38/4, Sheet No. 122, Englishpura', email: 'sehore@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Ranchi', city: 'Ranchi', address: 'Regent Tower Situated at Circuit House Road, opposite Aadiwasi Hostel', email: 'ranchi@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Raipur', city: 'Raipur', address: 'Madan Complex Shankar Nagar Road, Station Road, Shakti Nagar', email: 'raipur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Shivaji Nagar', city: 'Pune', address: 'Plot No. 557 / 1, 2 &3, Fergusson College Rd, Near Police Ground', email: 'pune@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Pimpari', city: 'Pune', address: 'Office No 401 402 Fourth Floor, RKL Business Centre, 168/2, Kokane Chowk', email: 'pimpri@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Prayagraj', city: 'Prayagraj', address: '33/19B/2, Lal Bahadur Shastri Marg, Civil Lines', email: 'prayagraj@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Danapur', city: 'Danapur', address: 'Swadha Sharda Complex, Saguna Khagaul Rd, near Canara Bank', email: 'patnadanapur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Patna', city: 'Patna', address: 'OLD R.K. Avenue, Rajendra Nagar Near Dinkar, Golambar', email: 'patna@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Goa', city: 'Goa', address: 'H. No.- 15/153/ A2, A3 & A4, Dr Jack de Siqueira Rd, Above Audi Showroom', email: 'goa@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Nashik', city: 'Nashik', address: 'Shop No. 12, BOSCO Center Mall Near Prasad Circle, Gangapur Road', email: 'nashik@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Nagaur', city: 'Nagaur', address: 'Plot No. 65, Gaurav Path, Sainik Basti', email: 'nagaur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Mysore', city: 'Mysore', address: 'Chamundeshwari Road, 861, NS Road, Near Siddappa Square', email: 'mysore@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Muzaffarpur', city: 'Muzaffarpur', address: 'Ground Floor, Landmark Building, Hathi chowk, Opp Zila School', email: 'muzaffarpur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Ludhiana', city: 'Ludhiana', address: 'Plot No.11,12-E Malhar Road, Sat Paul Mittal Rd, opp. AM TYRES', email: 'ludhiana@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Jodhpur 1', city: 'Jodhpur', address: '1, Pal Link Rd, Kamla Nehru Nagar, Shyam Nagar', email: 'jodhpur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Jodhpur 2', city: 'Jodhpur', address: 'Plot no. 7&8, Mandore Rd, Manji ka Hatha, Paota', email: 'jodhpur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Jamshedpur', city: 'Jamshedpur', address: '159, Dhalbhum Road, SNP Area, Ambagan, Sakchi', email: 'jamshedpur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Jaipur 1', city: 'Jaipur', address: 'Plot No C, JTN Anukampa Plaza, Ground Floor & First Floor, 20-A', email: 'jaipur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Jaipur 2', city: 'Jaipur', address: 'Plot No. 3, Saket Nagar, Opp. Pillar No. 114, Near Shyam Nagar Metro Stat', email: 'jaipur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Jabalpur', city: 'Jabalpur', address: '124, Napier Town Landmark, Near Shastri Bridge', email: 'jabalpur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Indore', city: 'Indore', address: 'Embassy Tower, Plot No. 9 / 1 / 3, First, Mahatma Gandhi Road', email: 'indore@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Hajipur', city: 'Hajipur', address: 'Naveen Plaza, Near Anjanpeer Chowk, Lalganj Road', email: 'hajipur@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Gwalior', city: 'Gwalior', address: 'Nigotia Tower, C-1 City Centre, Infront of Hotel Central Park', email: 'gwalior@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Guwahati 1', city: 'Guwahati', address: 'Shubham Redstone, First Floor, G.S. Road, Down Town, Bormotoria', email: 'guwahati@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Guwahati 2', city: 'Guwahati', address: 'Amaze Plaza, MD Shah Rd, opp. Hotel Hornbill, Paltan Bazaar', email: 'guwahatipb@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Dhanbad', city: 'Dhanbad', address: 'Unit No - G1, Ground Floor, near Raj Kamal School Ozone Centre', email: 'dhanbad@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Dehradun', city: 'Dehradun', address: '22/5, Haridwar Rd, opp. Uttarakhand State Roadways Workshop', email: 'dehradun@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Darbhanga', city: 'Darbhanga', address: 'Beena Imperia Benta, Ward No :, 43, VIP Rd, Laheriasarai', email: 'darbhanga@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Cuttak', city: 'Cuttak', address: 'Police Station, lot No: 588/978, Balaram Place, Baharbisinagar Unit 32', email: 'cuttack@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Bikaner', city: 'Bikaner', address: 'Near Khadi Emporium, opp. Khaturiya House, Rani Bazar', email: 'bikaner@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Bhubaneshwar', city: 'Bhubaneshwar', address: '1st Floor, Plot. no. 493 /1629, Kharvel Nagar Near Sriya Talkies', email: 'bhubaneswar@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Bhopal 1', city: 'Bhopal', address: 'Mahadev Commercial Complex, Shivaji Nagar, Bhopal, Madhya Pradesh 462', email: 'bhopal@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Kohefiza', city: 'Bhopal', address: 'A/6, Housing Board Colony, Kohefiza, Bhopal, Madhya Pradesh 462001', email: 'bhopal2@asgeyehospital.com' },
  { name: 'ASG Eye Hospital - Aurangabad', city: 'Aurangabad', address: 'AG Prime House No. 5-5-57, Kranti Chowk, Railway Station Rd, New Usman', email: 'aurangabad@asgeyehospital.com' }
];

async function main() {
    console.log('Starting to seed ASG Hospitals...');

    let inserted = 0;
    for (const hospital of asgHospitals) {
        // Upsert hospital
        await prisma.hospital.upsert({
            where: { email: hospital.email },
            update: {},
            create: {
                name: hospital.name,
                city: hospital.city,
                email: hospital.email,
                specialties: ['Ophthalmology', 'LASIK', 'Cataract'],
            },
        });
        inserted++;
    }

    console.log(`Successfully seeded ${inserted} ASG Eye Hospitals!`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
