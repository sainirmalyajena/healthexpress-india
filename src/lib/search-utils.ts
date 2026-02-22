/**
 * Common medical synonyms and aliases to improve search discoverability.
 * Maps common/layman terms to technical or database terms.
 * Includes Hindi synonyms to support multi-language search.
 */
export const surgerySynonyms: Record<string, string[]> = {
    // Piles / Haemorrhoids
    'piles': ['hemorrhoid', 'haemorrhoid', 'anorectal', 'बवासीर', 'पाइल्स'],
    'बवासीर': ['piles', 'hemorrhoid', 'haemorrhoid'],
    'पाइल्स': ['piles', 'hemorrhoid', 'haemorrhoid'],

    // Stones
    'stones': ['calculus', 'lithiasis', 'stone removal', 'पथरी'],
    'पथरी': ['stones', 'calculus', 'lithiasis'],
    'kidney stones': ['pcnl', 'eswl', 'ureteroscopy', 'renal calculus', 'गुर्दे की पथरी'],
    'गुर्दे की पथरी': ['kidney stones', 'pcnl', 'renal calculus'],
    'gallbladder stones': ['cholecystectomy', 'gallstone', 'पित्त की पथरी'],
    'पित्त की पथरी': ['gallbladder stones', 'cholecystectomy'],

    // Hernia
    'hernia': ['inguinal', 'ventral', 'umbilical', 'hernioplasty', 'हर्निया'],
    'हर्निया': ['hernia', 'inguinal', 'ventral'],

    // Appendix
    'appendix': ['appendectomy', 'appendicitis', 'अपेंडिक्स'],
    'अपेंडिक्स': ['appendix', 'appendectomy'],

    // Cataract
    'cataract': ['phacoemulsification', 'lens replacement', 'eye surgery', 'मोतियाबिंद'],
    'मोतियाबिंद': ['cataract', 'eye surgery', 'lens replacement'],

    // Orthopedic
    'joint pain': ['replacement', 'arthroplasty', 'arthroscopy', 'जोड़ों का दर्द'],
    'जोड़ों का दर्द': ['joint pain', 'replacement', 'arthroplasty'],
    'knee pain': ['knee replacement', 'acl reconstruction', 'meniscus repair', 'घुटने का दर्द'],
    'घुटने का दर्द': ['knee pain', 'knee replacement'],
    'hip pain': ['hip replacement', 'arthroplasty', 'कूल्हे का दर्द'],
    'कूल्हे का दर्द': ['hip pain', 'hip replacement'],

    // ENT
    'tonsils': ['tonsillectomy', 'adenoidectomy', 'टॉन्सिल'],
    'टॉन्सिल': ['tonsils', 'tonsillectomy'],
    'sinus': ['fess', 'septoplasty', 'sinusitis', 'साइनस'],
    'साइनस': ['sinus', 'sinusitis'],

    // Heart
    'heart': ['cardiac', 'bypass', 'cabg', 'angioplasty', 'valve', 'दिल'],
    'दिल': ['heart', 'cardiac', 'bypass'],

    // Spine
    'spine': ['spinal', 'discectomy', 'fusion', 'laminectomy', 'रीढ़'],
    'रीढ़': ['spine', 'spinal'],

    // Gynecology
    'uterus': ['hysterectomy', 'fibroid', 'gynecology', 'गर्भाशय'],
    'गर्भाशय': ['uterus', 'hysterectomy'],

    // Weight Loss
    'weight loss': ['bariatric', 'gastric sleeve', 'bypass', 'वजन घटाना'],
    'वजन घटाना': ['weight loss', 'bariatric'],

    // Other
    'fracture': ['orif', 'bone fixation', 'trauma', 'फ्रेक्चर', 'हड्डी टूटना'],
    'हड्डी टूटना': ['fracture', 'bone fixation'],
    'laser': ['laparoscopic', 'minimally invasive', 'लेजर'],
    'cancer': ['oncology', 'tumor', 'mastectomy', 'resection', 'कैंसर'],
    'कैंसर': ['cancer', 'oncology', 'tumor'],
    'prostate': ['turp', 'prostatectomy', 'urology', 'प्रोस्टेट'],
    'प्रोस्टेट': ['prostate', 'turp'],
};

/**
 * Expands a search query with its synonyms.
 * @param query The user's search query
 * @returns An array of strings representing the query and its potential synonyms
 */
export function expandQuery(query: string): string[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return [];

    const result = new Set([normalizedQuery]);

    // Check for exact matches and partial matches in synonym keys
    for (const [key, synonyms] of Object.entries(surgerySynonyms)) {
        if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
            synonyms.forEach(s => result.add(s));
        }
    }

    return Array.from(result);
}
