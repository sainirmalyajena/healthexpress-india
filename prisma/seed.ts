import { PrismaClient, Category, LeadStatus } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';
import { surgeryContent } from './surgery-content';

const prisma = new PrismaClient();

// Surgery data generator
function generateSurgeries() {
    const surgeries: Array<{
        name: string;
        slug: string;
        category: Category;
        overview: string;
        indications: string;
        procedure: string;
        duration: string;
        hospitalStay: string;
        recovery: string;
        risks: string;
        preparation: string;
        postOpCare: string;
        costRangeMin: number;
        costRangeMax: number;
        insuranceLikely: boolean;
        symptoms: string[];
        faqs: { question: string; answer: string }[];
    }> = [];

    // GENERAL SURGERY (15 surgeries)
    const generalSurgeries = [
        {
            name: 'Appendectomy',
            symptoms: ['abdominal pain', 'nausea', 'fever', 'loss of appetite'],
            costMin: 40000,
            costMax: 120000,
            insurance: true,
            duration: '1-2 hours',
            stay: '1-2 days',
        },
        {
            name: 'Hernia Repair',
            symptoms: ['bulge in groin', 'pain during lifting', 'discomfort'],
            costMin: 50000,
            costMax: 150000,
            insurance: true,
            duration: '1-2 hours',
            stay: '1-2 days',
        },
        {
            name: 'Gallbladder Removal (Cholecystectomy)',
            symptoms: ['upper abdominal pain', 'nausea', 'bloating', 'indigestion'],
            costMin: 60000,
            costMax: 180000,
            insurance: true,
            duration: '1-2 hours',
            stay: '1-2 days',
        },
        {
            name: 'Thyroidectomy',
            symptoms: ['neck swelling', 'difficulty swallowing', 'voice changes'],
            costMin: 80000,
            costMax: 200000,
            insurance: true,
            duration: '2-3 hours',
            stay: '1-3 days',
        },
        {
            name: 'Breast Lumpectomy',
            symptoms: ['breast lump', 'nipple discharge', 'skin changes'],
            costMin: 50000,
            costMax: 150000,
            insurance: true,
            duration: '1-2 hours',
            stay: '1 day',
        },
        {
            name: 'Mastectomy',
            symptoms: ['breast cancer', 'multiple tumors', 'genetic risk'],
            costMin: 100000,
            costMax: 300000,
            insurance: true,
            duration: '2-4 hours',
            stay: '3-5 days',
        },
        {
            name: 'Hemorrhoidectomy',
            symptoms: ['rectal bleeding', 'pain during bowel movements', 'itching'],
            costMin: 30000,
            costMax: 80000,
            insurance: true,
            duration: '30-60 minutes',
            stay: '1 day',
        },
        {
            name: 'Pilonidal Cyst Surgery',
            symptoms: ['tailbone pain', 'swelling', 'pus discharge'],
            costMin: 25000,
            costMax: 60000,
            insurance: true,
            duration: '1 hour',
            stay: '1 day',
        },
        {
            name: 'Lipoma Removal',
            symptoms: ['soft tissue lump', 'movable mass under skin'],
            costMin: 15000,
            costMax: 40000,
            insurance: false,
            duration: '30-60 minutes',
            stay: 'Daycare',
        },
        {
            name: 'Sebaceous Cyst Removal',
            symptoms: ['skin cyst', 'swelling', 'tenderness'],
            costMin: 10000,
            costMax: 30000,
            insurance: false,
            duration: '30 minutes',
            stay: 'Daycare',
        },
        {
            name: 'Varicose Vein Surgery',
            symptoms: ['visible veins', 'leg pain', 'swelling', 'skin discoloration'],
            costMin: 50000,
            costMax: 150000,
            insurance: true,
            duration: '1-2 hours',
            stay: '1 day',
        },
        {
            name: 'Splenectomy',
            symptoms: ['enlarged spleen', 'blood disorders', 'abdominal fullness'],
            costMin: 100000,
            costMax: 250000,
            insurance: true,
            duration: '2-3 hours',
            stay: '3-5 days',
        },
        {
            name: 'Adrenalectomy',
            symptoms: ['adrenal tumor', 'hormonal imbalance', 'high blood pressure'],
            costMin: 150000,
            costMax: 350000,
            insurance: true,
            duration: '2-4 hours',
            stay: '3-5 days',
        },
        {
            name: 'Parathyroidectomy',
            symptoms: ['high calcium', 'kidney stones', 'bone pain', 'fatigue'],
            costMin: 80000,
            costMax: 180000,
            insurance: true,
            duration: '1-2 hours',
            stay: '1-2 days',
        },
        {
            name: 'Lymph Node Biopsy',
            symptoms: ['swollen lymph nodes', 'persistent lumps', 'unexplained weight loss'],
            costMin: 20000,
            costMax: 50000,
            insurance: true,
            duration: '1 hour',
            stay: 'Daycare',
        },
    ];

    generalSurgeries.forEach((s) => {
        surgeries.push(createSurgery(s.name, Category.GENERAL_SURGERY, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
    });

    // ORTHOPEDICS (15 surgeries)
    const orthoSurgeries = [
        { name: 'Total Knee Replacement', symptoms: ['knee pain', 'stiffness', 'difficulty walking', 'arthritis'], costMin: 150000, costMax: 400000, insurance: true, duration: '2-3 hours', stay: '4-7 days' },
        { name: 'Total Hip Replacement', symptoms: ['hip pain', 'groin pain', 'limited mobility', 'arthritis'], costMin: 200000, costMax: 500000, insurance: true, duration: '2-3 hours', stay: '4-7 days' },
        { name: 'ACL Reconstruction', symptoms: ['knee instability', 'swelling', 'popping sound injury'], costMin: 100000, costMax: 250000, insurance: true, duration: '1-2 hours', stay: '1-2 days' },
        { name: 'Shoulder Arthroscopy', symptoms: ['shoulder pain', 'limited range', 'rotator cuff tear'], costMin: 80000, costMax: 200000, insurance: true, duration: '1-2 hours', stay: '1 day' },
        { name: 'Spinal Fusion', symptoms: ['back pain', 'leg weakness', 'spinal instability'], costMin: 300000, costMax: 800000, insurance: true, duration: '4-6 hours', stay: '5-10 days' },
        { name: 'Lumbar Discectomy', symptoms: ['sciatica', 'leg pain', 'numbness', 'herniated disc'], costMin: 150000, costMax: 350000, insurance: true, duration: '1-2 hours', stay: '2-3 days' },
        { name: 'Carpal Tunnel Release', symptoms: ['hand numbness', 'tingling', 'wrist pain', 'weak grip'], costMin: 30000, costMax: 80000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Bone Fracture Fixation (ORIF)', symptoms: ['broken bone', 'trauma', 'deformity'], costMin: 50000, costMax: 200000, insurance: true, duration: '1-3 hours', stay: '2-4 days' },
        { name: 'Meniscus Repair', symptoms: ['knee pain', 'locking', 'swelling', 'sports injury'], costMin: 60000, costMax: 150000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Rotator Cuff Repair', symptoms: ['shoulder pain', 'weakness', 'night pain', 'limited motion'], costMin: 100000, costMax: 250000, insurance: true, duration: '2 hours', stay: '1-2 days' },
        { name: 'Ankle Arthroscopy', symptoms: ['ankle pain', 'stiffness', 'instability'], costMin: 60000, costMax: 150000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Trigger Finger Release', symptoms: ['finger clicking', 'stiffness', 'painful snapping'], costMin: 15000, costMax: 40000, insurance: true, duration: '20 minutes', stay: 'Daycare' },
        { name: 'Bunion Surgery (Bunionectomy)', symptoms: ['toe deformity', 'foot pain', 'difficulty with shoes'], costMin: 40000, costMax: 100000, insurance: false, duration: '1 hour', stay: 'Daycare' },
        { name: 'Cervical Disc Replacement', symptoms: ['neck pain', 'arm pain', 'numbness'], costMin: 250000, costMax: 600000, insurance: true, duration: '2-3 hours', stay: '2-3 days' },
        { name: 'Arthroscopic Knee Surgery', symptoms: ['knee pain', 'cartilage damage', 'loose bodies'], costMin: 50000, costMax: 120000, insurance: true, duration: '1 hour', stay: 'Daycare' },
    ];

    orthoSurgeries.forEach((s) => {
        if (s.name === 'ACL Reconstruction') {
            surgeries.push(createSurgery(s.name, Category.ORTHOPEDICS, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay, {
                overview: "ACL Reconstruction is a surgical tissue graft replacement of the Anterior Cruciate Ligament, located in the knee, to restore its function after an injury. It is commonly performed on athletes and active individuals who wish to return to high-level sports or demanding physical activities.",
                procedure: "1) Arthroscopic examination to confirm the tear. 2) Harvesting the graft (usually hamstring, patellar tendon, or quadriceps tendon). 3) Drilling bone tunnels in the tibia and femur. 4) Passing the graft through the tunnels and securing it with screws or buttons. 5) Closing incisions and applying a brace.",
                recovery: "This is a major rehabilitation journey. Crutches are used for 1-2 weeks. Physical therapy starts immediately. Jogging may resume at 3-4 months, and return to competitive sports typically takes 9-12 months depending on muscle strength and graft healing."
            }));
        } else {
            surgeries.push(createSurgery(s.name, Category.ORTHOPEDICS, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
        }
    });

    // UROLOGY (12 surgeries)
    const uroSurgeries = [
        { name: 'TURP (Prostate Surgery)', symptoms: ['difficulty urinating', 'frequent urination', 'enlarged prostate'], costMin: 80000, costMax: 200000, insurance: true, duration: '1-2 hours', stay: '2-3 days' },
        { name: 'Kidney Stone Removal (PCNL)', symptoms: ['kidney pain', 'blood in urine', 'recurrent stones'], costMin: 80000, costMax: 200000, insurance: true, duration: '2-3 hours', stay: '3-5 days' },
        { name: 'Lithotripsy (ESWL)', symptoms: ['kidney stones', 'flank pain', 'urinary discomfort'], costMin: 30000, costMax: 80000, insurance: true, duration: '1 hour', stay: 'Daycare' },
        { name: 'Ureteroscopy', symptoms: ['ureteral stones', 'urinary blockage'], costMin: 50000, costMax: 120000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Nephrectomy (Kidney Removal)', symptoms: ['kidney cancer', 'non-functioning kidney', 'severe damage'], costMin: 150000, costMax: 400000, insurance: true, duration: '3-4 hours', stay: '5-7 days' },
        { name: 'Prostatectomy', symptoms: ['prostate cancer', 'elevated PSA'], costMin: 200000, costMax: 500000, insurance: true, duration: '3-4 hours', stay: '5-7 days' },
        { name: 'Circumcision', symptoms: ['phimosis', 'recurrent infections', 'religious/cultural'], costMin: 15000, costMax: 40000, insurance: false, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Vasectomy', symptoms: ['family planning', 'permanent contraception'], costMin: 10000, costMax: 30000, insurance: false, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Hydrocele Surgery', symptoms: ['scrotal swelling', 'discomfort', 'heaviness'], costMin: 30000, costMax: 80000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Varicocele Surgery', symptoms: ['scrotal pain', 'infertility', 'visible veins'], costMin: 40000, costMax: 100000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Bladder Tumor Removal (TURBT)', symptoms: ['blood in urine', 'painful urination', 'bladder cancer'], costMin: 60000, costMax: 150000, insurance: true, duration: '1-2 hours', stay: '2-3 days' },
        { name: 'Cystoscopy', symptoms: ['urinary issues', 'blood in urine', 'bladder problems'], costMin: 15000, costMax: 40000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
    ];

    uroSurgeries.forEach((s) => {
        if (s.name === 'Kidney Stone Removal (PCNL)') {
            surgeries.push(createSurgery(s.name, Category.UROLOGY, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay, {
                overview: "Percutaneous Nephrolithotomy (PCNL) is a minimally invasive procedure to remove large kidney stones (typically >2cm) that cannot be treated with other methods. It involves making a small incision in the back to access the kidney directly. This is the gold standard for complex stone burdens.",
                procedure: "1) General anesthesia is administered. 2) A small incision (<1cm) is made in the flank. 3) A tract is created into the kidney under X-ray or ultrasound guidance. 4) A nephroscope is inserted to visualize the stone. 5) The stone is fragmented using laser or pneumatic energy and fragments are suctioned out. 6) A small tube (nephrostomy) may be placed for drainage overnight.",
                recovery: "Most patients are discharged within 2-3 days. The small incision heals quickly with minimal scarring. You can return to desk work in 1 week and strenuous activities in 3-4 weeks. Drinking plenty of fluids is essential to prevent recurrence."
            }));
        } else {
            surgeries.push(createSurgery(s.name, Category.UROLOGY, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
        }
    });

    // Continue with more categories...
    // ENT (10 surgeries)
    const entSurgeries = [
        { name: 'Tonsillectomy', symptoms: ['recurrent tonsillitis', 'difficulty swallowing', 'sleep apnea'], costMin: 30000, costMax: 80000, insurance: true, duration: '30-60 minutes', stay: '1 day' },
        { name: 'Septoplasty', symptoms: ['nasal obstruction', 'deviated septum', 'breathing difficulty'], costMin: 40000, costMax: 100000, insurance: true, duration: '1-2 hours', stay: '1 day' },
        { name: 'FESS (Sinus Surgery)', symptoms: ['chronic sinusitis', 'nasal polyps', 'facial pain'], costMin: 50000, costMax: 150000, insurance: true, duration: '1-2 hours', stay: '1 day' },
        { name: 'Adenoidectomy', symptoms: ['breathing problems', 'snoring', 'ear infections'], costMin: 25000, costMax: 60000, insurance: true, duration: '30 minutes', stay: '1 day' },
        { name: 'Tympanoplasty', symptoms: ['perforated eardrum', 'hearing loss', 'ear discharge'], costMin: 40000, costMax: 100000, insurance: true, duration: '1-2 hours', stay: '1-2 days' },
        { name: 'Mastoidectomy', symptoms: ['chronic ear infection', 'cholesteatoma', 'mastoiditis'], costMin: 60000, costMax: 150000, insurance: true, duration: '2-3 hours', stay: '2-3 days' },
        { name: 'Cochlear Implant', symptoms: ['severe hearing loss', 'deafness'], costMin: 500000, costMax: 1200000, insurance: true, duration: '2-3 hours', stay: '2-3 days' },
        { name: 'Turbinate Reduction', symptoms: ['nasal congestion', 'breathing difficulty', 'turbinate hypertrophy'], costMin: 25000, costMax: 60000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Thyroglossal Duct Cyst Excision', symptoms: ['neck lump', 'midline swelling'], costMin: 40000, costMax: 100000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Laryngoscopy', symptoms: ['voice changes', 'throat problems', 'swallowing difficulty'], costMin: 15000, costMax: 40000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
    ];

    entSurgeries.forEach((s) => {
        surgeries.push(createSurgery(s.name, Category.ENT, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
    });

    // GYNECOLOGY (12 surgeries)
    const gynoSurgeries = [
        { name: 'Hysterectomy', symptoms: ['heavy bleeding', 'fibroids', 'uterine cancer', 'pelvic pain'], costMin: 80000, costMax: 250000, insurance: true, duration: '2-3 hours', stay: '3-5 days' },
        { name: 'Cesarean Section (C-Section)', symptoms: ['pregnancy complications', 'fetal distress', 'abnormal position'], costMin: 50000, costMax: 150000, insurance: true, duration: '1-2 hours', stay: '3-5 days' },
        { name: 'Laparoscopic Cyst Removal', symptoms: ['ovarian cyst', 'pelvic pain', 'bloating'], costMin: 50000, costMax: 150000, insurance: true, duration: '1-2 hours', stay: '1-2 days' },
        { name: 'Myomectomy', symptoms: ['uterine fibroids', 'heavy periods', 'fertility issues'], costMin: 80000, costMax: 200000, insurance: true, duration: '2-3 hours', stay: '2-4 days' },
        { name: 'D&C (Dilation and Curettage)', symptoms: ['abnormal bleeding', 'miscarriage', 'uterine polyps'], costMin: 15000, costMax: 40000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Tubal Ligation', symptoms: ['permanent contraception', 'family planning'], costMin: 20000, costMax: 50000, insurance: false, duration: '30 minutes', stay: '1 day' },
        { name: 'Colposcopy with Biopsy', symptoms: ['abnormal pap smear', 'cervical changes'], costMin: 10000, costMax: 30000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'LEEP Procedure', symptoms: ['cervical dysplasia', 'precancerous cells'], costMin: 20000, costMax: 50000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Endometrial Ablation', symptoms: ['heavy periods', 'menorrhagia'], costMin: 40000, costMax: 100000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Hysteroscopy', symptoms: ['abnormal bleeding', 'polyps', 'infertility workup'], costMin: 25000, costMax: 60000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Vaginal Prolapse Repair', symptoms: ['pelvic pressure', 'bulging', 'urinary issues'], costMin: 60000, costMax: 150000, insurance: true, duration: '2 hours', stay: '2-3 days' },
        { name: 'Salpingectomy', symptoms: ['ectopic pregnancy', 'tubal disease', 'cancer prevention'], costMin: 50000, costMax: 120000, insurance: true, duration: '1-2 hours', stay: '1-2 days' },
    ];

    gynoSurgeries.forEach((s) => {
        surgeries.push(createSurgery(s.name, Category.GYNECOLOGY, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
    });

    // OPHTHALMOLOGY (10 surgeries)
    const eyeSurgeries = [
        { name: 'Cataract Surgery', symptoms: ['cloudy vision', 'glare sensitivity', 'faded colors'], costMin: 25000, costMax: 80000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'LASIK Eye Surgery', symptoms: ['nearsightedness', 'farsightedness', 'astigmatism'], costMin: 40000, costMax: 100000, insurance: false, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Glaucoma Surgery', symptoms: ['high eye pressure', 'vision loss', 'tunnel vision'], costMin: 40000, costMax: 120000, insurance: true, duration: '1 hour', stay: 'Daycare' },
        { name: 'Retinal Detachment Repair', symptoms: ['floaters', 'flashes', 'vision curtain'], costMin: 80000, costMax: 200000, insurance: true, duration: '2-3 hours', stay: '1-2 days' },
        { name: 'Vitrectomy', symptoms: ['floaters', 'diabetic retinopathy', 'macular hole'], costMin: 80000, costMax: 200000, insurance: true, duration: '2-3 hours', stay: '1 day' },
        { name: 'Strabismus Surgery', symptoms: ['crossed eyes', 'eye misalignment'], costMin: 50000, costMax: 120000, insurance: true, duration: '1-2 hours', stay: '1 day' },
        { name: 'Eyelid Surgery (Blepharoplasty)', symptoms: ['droopy eyelids', 'vision obstruction'], costMin: 30000, costMax: 80000, insurance: false, duration: '1-2 hours', stay: 'Daycare' },
        { name: 'Pterygium Removal', symptoms: ['eye growth', 'redness', 'vision problems'], costMin: 15000, costMax: 40000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Corneal Transplant', symptoms: ['corneal damage', 'keratoconus', 'corneal scarring'], costMin: 100000, costMax: 300000, insurance: true, duration: '2 hours', stay: '2-3 days' },
        { name: 'PRK Eye Surgery', symptoms: ['vision correction', 'thin cornea'], costMin: 35000, costMax: 80000, insurance: false, duration: '30 minutes', stay: 'Daycare' },
    ];

    eyeSurgeries.forEach((s) => {
        if (s.name === 'Cataract Surgery') {
            surgeries.push(createSurgery(s.name, Category.OPHTHALMOLOGY, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay, {
                overview: "Cataract surgery removes the natural lens of your eye that has become cloudy and replaces it with an artificial intraocular lens (IOL). It is the most common and safest surgical procedure performed worldwide, restoring clear vision and significantly improving quality of life.",
                procedure: "1) Eye drops are used to dilate the pupil and numb the eye. 2) A microscopic incision is made. 3) Phacoemulsification (ultrasound) breaks up the cloudy lens. 4) The lens fragments are suctioned out. 5) The artificial IOL is folded, inserted, and unfolded in place. No stitches are usually needed.",
                recovery: "Vision often improves within hours. You may need to wear a protective shield while sleeping for a few days. Eye drops are prescribed for a few weeks to prevent infection. You can typically resume normal activities like reading and watching TV almost immediately."
            }));
        } else {
            surgeries.push(createSurgery(s.name, Category.OPHTHALMOLOGY, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
        }
    });

    // CARDIAC (10 surgeries)
    const cardiacSurgeries = [
        { name: 'Coronary Artery Bypass (CABG)', symptoms: ['chest pain', 'shortness of breath', 'blocked arteries'], costMin: 250000, costMax: 600000, insurance: true, duration: '4-6 hours', stay: '7-10 days' },
        { name: 'Heart Valve Replacement', symptoms: ['valve disease', 'murmur', 'fatigue', 'irregular heartbeat'], costMin: 350000, costMax: 800000, insurance: true, duration: '4-5 hours', stay: '7-10 days' },
        { name: 'Angioplasty with Stent', symptoms: ['chest pain', 'heart attack', 'coronary artery disease'], costMin: 150000, costMax: 350000, insurance: true, duration: '1-2 hours', stay: '2-3 days' },
        { name: 'Pacemaker Implantation', symptoms: ['slow heartbeat', 'fainting', 'fatigue', 'arrhythmia'], costMin: 200000, costMax: 500000, insurance: true, duration: '1-2 hours', stay: '2-3 days' },
        { name: 'ICD Implantation', symptoms: ['ventricular arrhythmia', 'cardiac arrest risk'], costMin: 400000, costMax: 900000, insurance: true, duration: '2-3 hours', stay: '2-3 days' },
        { name: 'Cardiac Catheterization', symptoms: ['chest pain', 'heart disease evaluation'], costMin: 30000, costMax: 80000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Atrial Septal Defect Closure', symptoms: ['congenital heart defect', 'fatigue', 'irregular heartbeat'], costMin: 150000, costMax: 400000, insurance: true, duration: '2-3 hours', stay: '3-5 days' },
        { name: 'Aortic Aneurysm Repair', symptoms: ['aneurysm', 'chest pain', 'back pain'], costMin: 300000, costMax: 700000, insurance: true, duration: '4-6 hours', stay: '7-14 days' },
        { name: 'Cardiac Ablation', symptoms: ['arrhythmia', 'rapid heartbeat', 'atrial fibrillation'], costMin: 150000, costMax: 350000, insurance: true, duration: '3-4 hours', stay: '2-3 days' },
        { name: 'Heart Transplant', symptoms: ['heart failure', 'cardiomyopathy'], costMin: 1500000, costMax: 3000000, insurance: true, duration: '6-8 hours', stay: '14-30 days' },
    ];

    cardiacSurgeries.forEach((s) => {
        surgeries.push(createSurgery(s.name, Category.CARDIAC, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
    });

    // NEURO (10 surgeries)
    const neuroSurgeries = [
        { name: 'Brain Tumor Removal', symptoms: ['headaches', 'seizures', 'vision problems', 'cognitive changes'], costMin: 300000, costMax: 800000, insurance: true, duration: '4-8 hours', stay: '7-14 days' },
        { name: 'Craniotomy', symptoms: ['brain access needed', 'tumor', 'aneurysm', 'bleeding'], costMin: 250000, costMax: 600000, insurance: true, duration: '4-6 hours', stay: '7-10 days' },
        { name: 'VP Shunt Surgery', symptoms: ['hydrocephalus', 'increased brain pressure', 'confusion'], costMin: 150000, costMax: 350000, insurance: true, duration: '1-2 hours', stay: '5-7 days' },
        { name: 'Deep Brain Stimulation', symptoms: ['Parkinsons disease', 'tremors', 'movement disorders'], costMin: 800000, costMax: 1500000, insurance: true, duration: '4-6 hours', stay: '5-7 days' },
        { name: 'Microdiscectomy', symptoms: ['herniated disc', 'sciatica', 'leg pain'], costMin: 100000, costMax: 250000, insurance: true, duration: '1-2 hours', stay: '1-2 days' },
        { name: 'Laminectomy', symptoms: ['spinal stenosis', 'back pain', 'nerve compression'], costMin: 150000, costMax: 350000, insurance: true, duration: '2-3 hours', stay: '3-5 days' },
        { name: 'Aneurysm Clipping', symptoms: ['brain aneurysm', 'severe headache', 'bleeding risk'], costMin: 300000, costMax: 700000, insurance: true, duration: '4-6 hours', stay: '7-14 days' },
        { name: 'Stereotactic Radiosurgery', symptoms: ['brain tumor', 'arteriovenous malformation'], costMin: 200000, costMax: 500000, insurance: true, duration: '1-3 hours', stay: '1-2 days' },
        { name: 'Carpal Tunnel Surgery (Neuro)', symptoms: ['hand numbness', 'nerve compression', 'wrist pain'], costMin: 30000, costMax: 80000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Spinal Cord Tumor Removal', symptoms: ['back pain', 'weakness', 'numbness', 'paralysis'], costMin: 400000, costMax: 900000, insurance: true, duration: '4-8 hours', stay: '10-14 days' },
    ];

    neuroSurgeries.forEach((s) => {
        surgeries.push(createSurgery(s.name, Category.NEURO, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
    });

    // GASTRO (12 surgeries)
    const gastroSurgeries = [
        { name: 'Colonoscopy', symptoms: ['screening', 'bleeding', 'bowel changes', 'polyps'], costMin: 15000, costMax: 40000, insurance: true, duration: '30-60 minutes', stay: 'Daycare' },
        { name: 'Upper GI Endoscopy', symptoms: ['acid reflux', 'stomach pain', 'swallowing difficulty'], costMin: 10000, costMax: 30000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Bariatric Surgery (Gastric Bypass)', symptoms: ['obesity', 'weight loss failure', 'metabolic syndrome'], costMin: 250000, costMax: 500000, insurance: false, duration: '3-4 hours', stay: '3-5 days' },
        { name: 'Sleeve Gastrectomy', symptoms: ['obesity', 'BMI > 40', 'weight related conditions'], costMin: 200000, costMax: 400000, insurance: false, duration: '1-2 hours', stay: '2-3 days' },
        { name: 'Liver Resection', symptoms: ['liver tumor', 'liver cancer', 'metastases'], costMin: 300000, costMax: 800000, insurance: true, duration: '4-6 hours', stay: '7-10 days' },
        { name: 'Whipple Procedure', symptoms: ['pancreatic cancer', 'bile duct cancer'], costMin: 400000, costMax: 1000000, insurance: true, duration: '6-8 hours', stay: '10-14 days' },
        { name: 'Hiatal Hernia Repair', symptoms: ['heartburn', 'acid reflux', 'chest pain'], costMin: 80000, costMax: 200000, insurance: true, duration: '2-3 hours', stay: '2-3 days' },
        { name: 'Bowel Resection', symptoms: ['colon cancer', 'Crohns disease', 'obstruction'], costMin: 150000, costMax: 400000, insurance: true, duration: '3-4 hours', stay: '5-10 days' },
        { name: 'ERCP', symptoms: ['gallstones in bile duct', 'jaundice', 'pancreatitis'], costMin: 40000, costMax: 100000, insurance: true, duration: '1-2 hours', stay: '1-2 days' },
        { name: 'Anal Fistula Surgery', symptoms: ['anal abscess', 'discharge', 'pain'], costMin: 30000, costMax: 80000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Fissurectomy', symptoms: ['anal fissure', 'pain during bowel movements', 'bleeding'], costMin: 20000, costMax: 50000, insurance: true, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Rectal Prolapse Repair', symptoms: ['rectal protrusion', 'incontinence', 'bowel movement difficulty'], costMin: 80000, costMax: 200000, insurance: true, duration: '2-3 hours', stay: '3-5 days' },
    ];

    gastroSurgeries.forEach((s) => {
        surgeries.push(createSurgery(s.name, Category.GASTRO, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
    });

    // DENTAL (8 surgeries)
    const dentalSurgeries = [
        { name: 'Dental Implant', symptoms: ['missing teeth', 'tooth loss', 'denture alternative'], costMin: 25000, costMax: 80000, insurance: false, duration: '1-2 hours', stay: 'Daycare' },
        { name: 'Wisdom Tooth Extraction', symptoms: ['impacted tooth', 'pain', 'infection', 'crowding'], costMin: 5000, costMax: 20000, insurance: true, duration: '30-60 minutes', stay: 'Daycare' },
        { name: 'Root Canal Treatment', symptoms: ['tooth pain', 'infection', 'abscess', 'sensitivity'], costMin: 5000, costMax: 15000, insurance: true, duration: '1-2 hours', stay: 'Daycare' },
        { name: 'Jaw Surgery (Orthognathic)', symptoms: ['jaw misalignment', 'bite problems', 'sleep apnea'], costMin: 150000, costMax: 400000, insurance: true, duration: '3-5 hours', stay: '2-4 days' },
        { name: 'Gum Surgery (Periodontal)', symptoms: ['gum disease', 'receding gums', 'bone loss'], costMin: 10000, costMax: 40000, insurance: true, duration: '1-2 hours', stay: 'Daycare' },
        { name: 'Apicoectomy', symptoms: ['root tip infection', 'failed root canal', 'persistent pain'], costMin: 8000, costMax: 25000, insurance: true, duration: '1 hour', stay: 'Daycare' },
        { name: 'Bone Grafting (Dental)', symptoms: ['bone loss', 'implant preparation', 'jaw deterioration'], costMin: 20000, costMax: 60000, insurance: false, duration: '1-2 hours', stay: 'Daycare' },
        { name: 'TMJ Surgery', symptoms: ['jaw pain', 'clicking', 'lockjaw', 'TMJ disorder'], costMin: 50000, costMax: 150000, insurance: true, duration: '2-3 hours', stay: '1-2 days' },
    ];

    dentalSurgeries.forEach((s) => {
        surgeries.push(createSurgery(s.name, Category.DENTAL, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
    });

    // COSMETIC (10 surgeries)
    const cosmeticSurgeries = [
        { name: 'Rhinoplasty (Nose Job)', symptoms: ['nose shape', 'breathing issues', 'aesthetic'], costMin: 60000, costMax: 200000, insurance: false, duration: '2-3 hours', stay: '1 day' },
        { name: 'Liposuction', symptoms: ['stubborn fat', 'body contouring'], costMin: 50000, costMax: 200000, insurance: false, duration: '1-3 hours', stay: '1 day' },
        { name: 'Tummy Tuck (Abdominoplasty)', symptoms: ['excess skin', 'loose abdomen', 'post-pregnancy'], costMin: 100000, costMax: 300000, insurance: false, duration: '3-4 hours', stay: '2-3 days' },
        { name: 'Breast Augmentation', symptoms: ['breast enhancement', 'asymmetry'], costMin: 100000, costMax: 300000, insurance: false, duration: '2 hours', stay: '1 day' },
        { name: 'Breast Reduction', symptoms: ['large breasts', 'back pain', 'discomfort'], costMin: 80000, costMax: 250000, insurance: true, duration: '3-4 hours', stay: '1-2 days' },
        { name: 'Facelift', symptoms: ['facial aging', 'sagging skin', 'wrinkles'], costMin: 150000, costMax: 400000, insurance: false, duration: '3-5 hours', stay: '1-2 days' },
        { name: 'Blepharoplasty (Cosmetic)', symptoms: ['droopy eyelids', 'under-eye bags', 'aging eyes'], costMin: 40000, costMax: 120000, insurance: false, duration: '1-2 hours', stay: 'Daycare' },
        { name: 'Otoplasty (Ear Surgery)', symptoms: ['protruding ears', 'ear deformity'], costMin: 40000, costMax: 100000, insurance: false, duration: '1-2 hours', stay: 'Daycare' },
        { name: 'Hair Transplant', symptoms: ['baldness', 'hair loss', 'receding hairline'], costMin: 50000, costMax: 200000, insurance: false, duration: '4-8 hours', stay: 'Daycare' },
        { name: 'Gynecomastia Surgery', symptoms: ['enlarged male breasts', 'chest tissue'], costMin: 50000, costMax: 150000, insurance: false, duration: '1-2 hours', stay: '1 day' },
    ];

    cosmeticSurgeries.forEach((s) => {
        surgeries.push(createSurgery(s.name, Category.COSMETIC, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
    });

    // PEDIATRIC (10 surgeries)
    const pediatricSurgeries = [
        { name: 'Pediatric Hernia Repair', symptoms: ['groin bulge', 'crying with activity', 'inguinal hernia'], costMin: 40000, costMax: 100000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Pediatric Appendectomy', symptoms: ['abdominal pain', 'fever', 'vomiting', 'appendicitis'], costMin: 50000, costMax: 120000, insurance: true, duration: '1-2 hours', stay: '2-3 days' },
        { name: 'Cleft Lip Repair', symptoms: ['cleft lip', 'congenital deformity'], costMin: 60000, costMax: 150000, insurance: true, duration: '2-3 hours', stay: '2-3 days' },
        { name: 'Cleft Palate Repair', symptoms: ['cleft palate', 'feeding difficulty', 'speech problems'], costMin: 80000, costMax: 200000, insurance: true, duration: '2-3 hours', stay: '3-5 days' },
        { name: 'Hypospadias Repair', symptoms: ['urethral opening abnormality', 'congenital'], costMin: 60000, costMax: 150000, insurance: true, duration: '2-3 hours', stay: '2-3 days' },
        { name: 'Undescended Testes Surgery', symptoms: ['cryptorchidism', 'undescended testicle'], costMin: 40000, costMax: 100000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Pyloromyotomy', symptoms: ['projectile vomiting', 'pyloric stenosis', 'infant'], costMin: 60000, costMax: 150000, insurance: true, duration: '1 hour', stay: '2-3 days' },
        { name: 'Tonsillectomy and Adenoidectomy (Pediatric)', symptoms: ['sleep apnea', 'recurrent infections', 'snoring'], costMin: 35000, costMax: 80000, insurance: true, duration: '1 hour', stay: '1 day' },
        { name: 'Pediatric Circumcision', symptoms: ['phimosis', 'recurrent infections'], costMin: 10000, costMax: 30000, insurance: false, duration: '30 minutes', stay: 'Daycare' },
        { name: 'Umbilical Hernia Repair (Pediatric)', symptoms: ['belly button bulge', 'umbilical hernia'], costMin: 30000, costMax: 80000, insurance: true, duration: '1 hour', stay: '1 day' },
    ];

    pediatricSurgeries.forEach((s) => {
        surgeries.push(createSurgery(s.name, Category.PEDIATRIC, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
    });

    // ONCOLOGY (12 surgeries)
    const oncologySurgeries = [
        { name: 'Breast Cancer Surgery', symptoms: ['breast lump', 'cancer diagnosis'], costMin: 100000, costMax: 350000, insurance: true, duration: '2-4 hours', stay: '3-5 days' },
        { name: 'Colon Cancer Resection', symptoms: ['colon cancer', 'bowel obstruction', 'rectal bleeding'], costMin: 200000, costMax: 500000, insurance: true, duration: '3-5 hours', stay: '7-10 days' },
        { name: 'Lung Cancer Surgery (Lobectomy)', symptoms: ['lung cancer', 'persistent cough', 'breathing difficulty'], costMin: 300000, costMax: 700000, insurance: true, duration: '3-5 hours', stay: '5-10 days' },
        { name: 'Gastric Cancer Surgery', symptoms: ['stomach cancer', 'weight loss', 'abdominal pain'], costMin: 250000, costMax: 600000, insurance: true, duration: '4-6 hours', stay: '7-14 days' },
        { name: 'Thyroid Cancer Surgery', symptoms: ['thyroid cancer', 'neck lump', 'voice changes'], costMin: 100000, costMax: 250000, insurance: true, duration: '2-3 hours', stay: '2-4 days' },
        { name: 'Ovarian Cancer Surgery', symptoms: ['ovarian cancer', 'pelvic pain', 'bloating'], costMin: 200000, costMax: 500000, insurance: true, duration: '3-5 hours', stay: '5-10 days' },
        { name: 'Pancreatic Cancer Surgery', symptoms: ['pancreatic cancer', 'jaundice', 'weight loss'], costMin: 400000, costMax: 1000000, insurance: true, duration: '6-8 hours', stay: '10-14 days' },
        { name: 'Esophageal Cancer Surgery', symptoms: ['esophageal cancer', 'difficulty swallowing', 'weight loss'], costMin: 300000, costMax: 800000, insurance: true, duration: '5-7 hours', stay: '10-14 days' },
        { name: 'Kidney Cancer Surgery', symptoms: ['kidney cancer', 'blood in urine', 'flank pain'], costMin: 200000, costMax: 500000, insurance: true, duration: '3-4 hours', stay: '5-7 days' },
        { name: 'Bladder Cancer Surgery', symptoms: ['bladder cancer', 'blood in urine', 'painful urination'], costMin: 150000, costMax: 400000, insurance: true, duration: '3-5 hours', stay: '5-10 days' },
        { name: 'Skin Cancer Excision', symptoms: ['skin cancer', 'melanoma', 'abnormal mole'], costMin: 30000, costMax: 100000, insurance: true, duration: '1-2 hours', stay: 'Daycare' },
        { name: 'Lymphoma Treatment Surgery', symptoms: ['lymphoma', 'swollen nodes', 'night sweats'], costMin: 150000, costMax: 400000, insurance: true, duration: '2-4 hours', stay: '3-7 days' },
    ];

    oncologySurgeries.forEach((s) => {
        surgeries.push(createSurgery(s.name, Category.ONCOLOGY, s.symptoms, s.costMin, s.costMax, s.insurance, s.duration, s.stay));
    });

    return surgeries;
}

function createSurgery(
    name: string,
    category: Category,
    symptoms: string[],
    costMin: number,
    costMax: number,
    insurance: boolean,
    duration: string,
    stay: string,
    overrides?: {
        overview?: string;
        procedure?: string;
        recovery?: string;
    }
) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const content = surgeryContent[name];

    return {
        name,
        slug,
        category,
        overview: overrides?.overview || content?.overview || `${name} is a ${insurance ? 'commonly performed' : 'specialized'} procedure in ${getCategoryName(category)}. This surgery is designed to address specific medical conditions and improve patient quality of life. Our partner hospitals across India offer this procedure with experienced surgeons and modern facilities.`,
        indications: `${name} may be recommended when conservative treatments have not been effective. Common reasons include: ${symptoms.join(', ')}. Your doctor will evaluate your specific condition through physical examination and diagnostic tests to determine if this surgery is the right option for you.`,
        procedure: overrides?.procedure || content?.procedure || `The ${name} procedure typically involves: 1) Pre-operative preparation and anesthesia administration, 2) The surgical intervention using appropriate technique (open or minimally invasive depending on the case), 3) Careful closure and wound care, 4) Recovery monitoring in the post-anesthesia care unit. The specific approach depends on individual patient factors and surgeon preference.`,
        duration,
        hospitalStay: stay,
        recovery: overrides?.recovery || content?.recovery || `Recovery from ${name} varies by individual. Most patients can resume light activities within 1-2 weeks, with full recovery typically taking 4-8 weeks. Follow your surgeon's specific instructions regarding activity restrictions, wound care, and follow-up appointments.`,
        risks: `As with any surgical procedure, ${name} carries potential risks including bleeding, infection, adverse reaction to anesthesia, blood clots, and procedure-specific complications. Your surgeon will discuss these risks in detail and take all necessary precautions to minimize them.`,
        preparation: `Before ${name}: 1) Complete all required pre-operative tests and evaluations, 2) Inform your doctor about all medications and supplements, 3) Follow fasting instructions (typically no food/drink after midnight before surgery), 4) Arrange for transportation and post-operative care at home, 5) Prepare your home for recovery with necessary supplies.`,
        postOpCare: `After ${name}: 1) Take prescribed medications as directed, 2) Keep the surgical site clean and dry, 3) Watch for signs of infection (increased pain, redness, fever, discharge), 4) Follow activity restrictions and gradually increase activity as advised, 5) Attend all follow-up appointments, 6) Contact your doctor immediately if you experience concerning symptoms.`,
        costRangeMin: costMin,
        costRangeMax: costMax,
        insuranceLikely: insurance,
        availableCities: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Gurgaon'].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2),
        symptoms,
        faqs: [
            {
                question: `How long does ${name} take?`,
                answer: `${name} typically takes ${duration}. However, the actual duration may vary based on complexity and individual factors.`
            },
            {
                question: `What is the recovery time for ${name}?`,
                answer: `Hospital stay is usually ${stay}. Most patients return to normal activities within 2-6 weeks, depending on the type of work and individual healing.`
            },
            {
                question: `Is ${name} covered by insurance?`,
                answer: insurance
                    ? `Yes, ${name} is usually covered by health insurance when medically necessary. Coverage details vary by policy, so please check with your insurance provider.`
                    : `${name} may not be covered by standard health insurance as it's often considered elective. Please check with your insurance provider for specific coverage details.`
            },
            {
                question: `What are the alternatives to ${name}?`,
                answer: `Alternative treatments depend on your specific condition and may include medication, lifestyle changes, or other procedures. Your doctor will discuss all options and recommend the most appropriate treatment for your situation.`
            }
        ]
    };
}

function getCategoryName(category: Category): string {
    const names: Record<Category, string> = {
        GENERAL_SURGERY: 'General Surgery',
        ORTHOPEDICS: 'Orthopedics',
        UROLOGY: 'Urology',
        ENT: 'ENT (Ear, Nose, Throat)',
        GYNECOLOGY: 'Gynecology',
        OPHTHALMOLOGY: 'Ophthalmology',
        CARDIAC: 'Cardiac Surgery',
        NEURO: 'Neurosurgery',
        GASTRO: 'Gastroenterology',
        DENTAL: 'Dental Surgery',
        COSMETIC: 'Cosmetic Surgery',
        PEDIATRIC: 'Pediatric Surgery',
        ONCOLOGY: 'Oncology'
    };
    return names[category];
}

async function createDoctors(passwordHash: string) {
    console.log('Creating doctors...');

    // Get some hospitals
    const hospitals = await prisma.hospital.findMany();
    if (hospitals.length === 0) {
        console.log('No hospitals found to link doctors.');
        return;
    }

    // Get surgeries to link
    const kneeReplacement = await prisma.surgery.findFirst({ where: { slug: 'total-knee-replacement' } });
    const cabg = await prisma.surgery.findFirst({ where: { slug: 'coronary-artery-bypass-grafting-cabg' } });
    const lasik = await prisma.surgery.findFirst({ where: { slug: 'lasik-eye-surgery' } });
    const rhinoplasty = await prisma.surgery.findFirst({ where: { slug: 'rhinoplasty-nose-job' } });
    const ivf = await prisma.surgery.findFirst({ where: { slug: 'ivf-treatment' } });

    const doctorsData = [
        {
            name: "Dr. Amit Sharma",
            qualification: "MBBS, MS - Orthopedics",
            experience: 15,
            email: "ortho@healthexpress.in",
            passwordHash,
            about: "Senior Orthopedic Surgeon specializing in joint replacement surgeries. Has performed over 2000 successful knee and hip replacements.",
            hospitalId: hospitals[0].id,
            surgeries: kneeReplacement ? { connect: { id: kneeReplacement.id } } : undefined,
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
        },
        {
            name: "Dr. Priya Desai",
            qualification: "MBBS, MD - Cardiology",
            experience: 18,
            email: "cardio@healthexpress.in",
            passwordHash,
            about: "Renowned Cardiologist with expertise in interventional cardiology and bypass surgeries. Dedicated to patient-centric heart care.",
            hospitalId: hospitals[1] ? hospitals[1].id : hospitals[0].id,
            surgeries: cabg ? { connect: { id: cabg.id } } : undefined,
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop"
        },
        {
            name: "Dr. Rajesh Iyer",
            qualification: "MBBS, MS - Ophthalmology",
            experience: 12,
            email: "eye@healthexpress.in",
            passwordHash,
            about: "Expert in refractive surgeries including LASIK and Cataract. Committed to restoring vision with advanced technology.",
            hospitalId: hospitals[2] ? hospitals[2].id : hospitals[0].id,
            surgeries: lasik ? { connect: { id: lasik.id } } : undefined,
            image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop"
        },
        {
            name: "Dr. Neha Gupta",
            qualification: "MBBS, MCh - Plastic Surgery",
            experience: 10,
            email: "cosmetic@healthexpress.in",
            passwordHash,
            about: "Board-certified Cosmetic Surgeon known for natural-looking results in Rhinoplasty and Liposuction.",
            hospitalId: hospitals[0].id,
            surgeries: rhinoplasty ? { connect: { id: rhinoplasty.id } } : undefined,
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop"
        },
        {
            name: "Dr. Vikram Singh",
            qualification: "MBBS, MD - Gynecology",
            experience: 20,
            email: "gyno@healthexpress.in",
            passwordHash,
            about: "Leading Gynecologist specializing in infertility treatments and high-risk pregnancies.",
            hospitalId: hospitals[1] ? hospitals[1].id : hospitals[0].id,
            surgeries: ivf ? { connect: { id: ivf.id } } : undefined,
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop"
        }
    ];

    for (const doc of doctorsData) {
        await prisma.doctor.create({
            data: doc
        });
    }

    console.log(`Created ${doctorsData.length} doctors`);
}

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.lead.deleteMany();
    await prisma.doctor.deleteMany(); // Clear doctors first
    await prisma.surgery.deleteMany();
    await prisma.hospital.deleteMany();
    await prisma.user.deleteMany();
    await prisma.partnerRequest.deleteMany();

    // Create admin user
    console.log('Creating admin user...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const adminHashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
        data: {
            email: 'admin@healthexpress.in',
            passwordHash: adminHashedPassword,
            name: 'Admin User',
            role: 'admin',
        },
    });

    // Create hospitals
    console.log('Creating hospitals...');
    const hospitals = [
        { name: 'Apollo Hospital', city: 'Mumbai', email: 'apollo@healthexpress.in', passwordHash, specialties: ['Cardiac', 'Orthopedics', 'General Surgery'], discountPercent: 15 },
        { name: 'Fortis Healthcare', city: 'Delhi', email: 'fortis@healthexpress.in', passwordHash, specialties: ['Neuro', 'Gastro', 'Oncology'], discountPercent: 10 },
        { name: 'Max Super Speciality', city: 'Bangalore', email: 'max@healthexpress.in', passwordHash, specialties: ['Opthalmology', 'Dental', 'Cosmetic'], discountPercent: 20 },
        { name: 'Manipal Hospital', city: 'Pune', email: 'manipal@healthexpress.in', passwordHash, specialties: ['Pediatric', 'Gynecology', 'Urology'], discountPercent: 12 },
        { name: 'Medanta - The Medicity', city: 'Gurgaon', email: 'medanta@healthexpress.in', passwordHash, specialties: ['Cardiac', 'Neuro', 'Orthopedics'], discountPercent: 18 },
    ];

    const createdHospitals = [];
    for (const h of hospitals) {
        const hospital = await prisma.hospital.create({ data: h });
        createdHospitals.push(hospital);
    }

    // Create surgeries
    console.log('Creating surgeries...');
    const surgeriesData = generateSurgeries();
    console.log(`Generated ${surgeriesData.length} surgeries`);

    const createdSurgeries = [];
    for (const s of surgeriesData) {
        const surgery = await prisma.surgery.create({
            data: s
        });
        createdSurgeries.push(surgery);
    }

    // Create Doctors
    await createDoctors(passwordHash);

    // Create sample leads (Cases)
    console.log('Creating sample cases...');
    const leadNames = ['John Doe', 'Jane Smith', 'Rahul Kumar', 'Anita Desai', 'David Wilson'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Gurgaon'];
    const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'ASSIGNED', 'SCHEDULED', 'COMPLETED', 'CLOSED'];

    for (let i = 0; i < 15; i++) {
        const surgery = createdSurgeries[Math.floor(Math.random() * createdSurgeries.length)];
        const hospital = i > 5 ? createdHospitals[Math.floor(Math.random() * createdHospitals.length)] : null;
        const status = i < 5 ? 'NEW' : statuses[Math.floor(Math.random() * statuses.length)];

        const originalCost = Math.floor(Math.random() * (surgery.costRangeMax - surgery.costRangeMin) + surgery.costRangeMin);
        const hasCard = Math.random() > 0.4;
        const discount = (hasCard && hospital) ? (originalCost * (hospital.discountPercent / 100)) : 0;
        const discountedCost = originalCost - discount;
        const revenue = discountedCost * 0.15; // 15% commission

        await prisma.lead.create({
            data: {
                fullName: leadNames[i % leadNames.length],
                phone: `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                email: `patient${i}@example.com`,
                city: cities[i % cities.length],
                surgeryId: surgery.id,
                hospitalId: hospital?.id,
                description: 'Patient needs urgent consultation regarding ' + surgery.name,
                insurance: Math.random() > 0.5 ? 'YES' : 'NO',
                hasCard,
                isEmergency: Math.random() > 0.8,
                status: status as LeadStatus,
                originalCost,
                discountedCost,
                revenue,
                sourcePage: '/',
                referenceId: `HE-${Date.now()}-${i}`
            }
        });
    }

    console.log('✅ Seed completed successfully!');
    console.log(`- Created 1 admin user (email: admin@healthexpress.in, password: admin123)`);
    console.log(`- Created ${createdHospitals.length} hospitals`);
    console.log(`- Created ${createdSurgeries.length} surgeries`);
    console.log(`- Created 5 doctors`);
    console.log(`- Created 15 sample leads/cases`);
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
