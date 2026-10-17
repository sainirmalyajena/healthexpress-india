import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateReferenceId(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `HE-${timestamp}-${random}`;
}

export function formatCurrency(amount?: number | null): string {
    const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(num);
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCategoryLabel(category: string, dict?: any): string {
    if (dict && dict[category]) return dict[category];

    const labels: Record<string, string> = {
        GENERAL_SURGERY: 'General Surgery',
        ORTHOPEDICS: 'Orthopedics',
        UROLOGY: 'Urology',
        ENT: 'ENT',
        GYNECOLOGY: 'Gynecology',
        OPHTHALMOLOGY: 'Ophthalmology',
        CARDIAC: 'Cardiac',
        NEURO: 'Neuro',
        GASTRO: 'Gastro',
        DENTAL: 'Dental',
        COSMETIC: 'Cosmetic',
        PEDIATRIC: 'Pediatric',
        ONCOLOGY: 'Oncology',
    };
    return labels[category] || category;
}

export function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
        GENERAL_SURGERY: '🏥',
        ORTHOPEDICS: '🦴',
        UROLOGY: '💧',
        ENT: '👂',
        GYNECOLOGY: '👶',
        OPHTHALMOLOGY: '👁️',
        CARDIAC: '❤️',
        NEURO: '🧠',
        GASTRO: '🍽️',
        DENTAL: '🦷',
        COSMETIC: '✨',
        PEDIATRIC: '👶',
        ONCOLOGY: '🎗️',
    };
    return icons[category] || '🏥';
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        NEW: 'bg-blue-100 text-blue-800',
        CONTACTED: 'bg-yellow-100 text-yellow-800',
        FOLLOW_UP: 'bg-orange-100 text-orange-800',
        CALL_BACK: 'bg-purple-100 text-purple-800',
        DNP: 'bg-red-100 text-red-800',
        CLOSED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

export function extractUTMParams(url: string): Record<string, string> {
    const params: Record<string, string> = {};
    try {
        const urlObj = new URL(url);
        const utmKeys = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_term', 'utm_content'];
        utmKeys.forEach((key) => {
            const value = urlObj.searchParams.get(key);
            if (value) {
                params[key.replace('utm_', '')] = value;
            }
        });
    } catch {
        // Invalid URL, return empty params
    }
    return params;
}

export function cleanLeadNotes(notes: string | null): string {
    if (!notes) return '';
    const junkPrefixes = [
        '[Meta Lead Ads',
        '[Meta Ads Import]',
        'Leadgen ID:',
        'Form ID:',
        'Page ID:',
        'Platform:',
        'Form:',
        'Campaign:',
        'Ad Name:',
        'Assigned To:',
        '--- Lead Details ---',
    ];
    
    return notes.split('\n').filter(line => {
        const trimmed = line.trim();
        if (!trimmed) return false;
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) return false;
        if (trimmed.toLowerCase().startsWith('fields:')) return false;
        return !junkPrefixes.some(prefix => trimmed.startsWith(prefix));
    }).join('\n').trim();
}

export function getISTDayRange(date = new Date(), offsetDays = 0) {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() + offsetDays);
    
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: 'numeric', day: 'numeric',
    });
    const istDateString = formatter.format(adjustedDate);
    const [month, day, year] = istDateString.split('/').map(Number);
    
    const isoStringStart = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00+05:30`;
    const startOfDay = new Date(isoStringStart);
    
    const isoStringEnd = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T23:59:59.999+05:30`;
    const endOfDay = new Date(isoStringEnd);
    
    return { 
        startOfToday: startOfDay, 
        endOfToday: endOfDay,
        startOfDay,
        endOfDay
    };
}

export function getISTPeriodRanges() {
    const { startOfToday, endOfToday } = getISTDayRange();
    
    // Start of Week (last 7 days in IST)
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    
    // Start of Month (1st of current month in IST)
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: 'numeric'
    });
    const [month, year] = formatter.format(new Date()).split('/').map(Number);
    const startOfMonth = new Date(`${year}-${month.toString().padStart(2, '0')}-01T00:00:00+05:30`);
    
    return {
        startOfToday,
        endOfToday,
        startOfWeek,
        startOfMonth
    };
}

export function formatWhatsAppPhone(phone?: string | null): string {
    if (!phone) return '';
    const clean = String(phone).replace(/[^0-9]/g, '');
    if (clean.length === 10) return `91${clean}`;
    return clean;
}

export function generateOpdWhatsAppMessage({
    patientName,
    hospitalName,
    hospitalAddress,
    googleMapsUrl,
    opdDate,
}: {
    patientName: string;
    hospitalName?: string | null;
    hospitalAddress?: string | null;
    googleMapsUrl?: string | null;
    opdDate?: Date | string | null;
}): string {
    const hName = hospitalName || 'our partner hospital';
    const hAddress = hospitalAddress || 'Address will be shared shortly';
    const hMap = googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(hName)}`;

    let dateStr = 'Scheduled Date';
    let timeStr = 'Scheduled Time';

    if (opdDate) {
        const d = new Date(opdDate);
        if (!isNaN(d.getTime())) {
            const weekday = new Intl.DateTimeFormat('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' }).format(d);
            const day = new Intl.DateTimeFormat('en-IN', { day: '2-digit', timeZone: 'Asia/Kolkata' }).format(d);
            const month = new Intl.DateTimeFormat('en-IN', { month: '2-digit', timeZone: 'Asia/Kolkata' }).format(d);
            const year = new Intl.DateTimeFormat('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' }).format(d);
            dateStr = `${weekday}-${day}/${month}/${year}`;
            
            timeStr = new Intl.DateTimeFormat('en-IN', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            }).format(d).replace(/\s+/g, '').toUpperCase();
        }
    }

    return `Dear ${patientName}, 

Your appointment has been successfully scheduled at ${hName}.

Please find the details below:

Patient Name: ${patientName}

Appointment Date: ${dateStr}

Time: ${timeStr}

Consultation Fee: Free
Test Charges: Free

🏥 Hospital Location & Address:
${hName}

${hAddress}

📍 Google Maps Link: 
${hMap}

Important Instructions:

Kindly arrive 10–15 minutes prior to your scheduled time for a hassle-free registration process.


Thank you for choosing Healthexpress India. We look forward to assisting You.

Best regards, 
https://www.healthexpressindia.com/en`;
}

export function generatePostOpdFollowUpMessage({
    patientName,
    hospitalName,
    surgeryName,
}: {
    patientName: string;
    hospitalName?: string | null;
    surgeryName?: string | null;
}): string {
    const hName = hospitalName || 'our partner hospital';
    const sName = surgeryName ? ` regarding your ${surgeryName}` : '';

    return `Dear ${patientName},

We hope your consultation with the doctor at ${hName}${sName} went smoothly! 🏥

Our medical care team is following up to check on your visit:
1️⃣ Did the doctor recommend any medication, diagnostic tests, or a procedure?
2️⃣ Would you like us to help you with 100% cashless insurance approval, test discounts, or a second opinion?
3️⃣ Do you have any questions or need doctor follow-up assistance?

Please reply to this message or call us anytime. We are here to support your full recovery.

Warm regards,
HealthExpress India Care Team
📞 93078-61041
🌐 https://www.healthexpressindia.com/en`;
}

export function generateSurgerySuggestedWhatsAppMessage({
    patientName,
    hospitalName,
    surgeryName,
}: {
    patientName: string;
    hospitalName?: string | null;
    surgeryName?: string | null;
}): string {
    const hName = hospitalName || 'our partner hospital';
    const sName = surgeryName ? ` for ${surgeryName}` : '';

    return `Dear ${patientName},

This is HealthExpress India following up on your consultation at ${hName}.

Since surgery${sName} has been advised by the doctor, our dedicated care team is here to coordinate everything for you:
✅ 100% Cashless Health Insurance pre-authorization & paperwork
✅ 0% Interest EMI & flexible financing options
✅ Dedicated Care Coordinator for hospital admission & discharge
✅ Free cab pick-up & drop on the day of surgery

When would be a convenient time for a quick 2-minute call to discuss your treatment plan and cost estimate?

Warm regards,
HealthExpress India Care Team
📞 93078-61041
🌐 https://www.healthexpressindia.com/en`;
}

export function generateRnrPostOpdWhatsAppMessage({
    patientName,
    hospitalName,
}: {
    patientName: string;
    hospitalName?: string | null;
}): string {
    const hName = hospitalName || 'our partner hospital';

    return `Dear ${patientName},

We tried connecting with you following your scheduled consultation at ${hName}.

Please let us know a convenient time to speak, or reply to this message with an update on your doctor consultation. Our team is here to assist with any prescribed tests, medicines, or next steps.

Wishing you good health,
HealthExpress India Care Team
📞 93078-61041`;
}

export function generateMedicalManagementWhatsAppMessage({
    patientName,
    hospitalName,
}: {
    patientName: string;
    hospitalName?: string | null;
}): string {
    const hName = hospitalName || 'our partner hospital';

    return `Dear ${patientName},

We hope you are recovering well with the medication and treatment advised during your visit to ${hName}. 💊

If you need any assistance with medicine delivery, follow-up review with the doctor, or further guidance, feel free to reach out to us.

Wishing you a fast and smooth recovery!

Warm regards,
HealthExpress India Care Team
📞 93078-61041`;
}

export function generateGeneralFollowUpWhatsAppMessage({
    patientName,
    surgeryName,
    city,
}: {
    patientName: string;
    surgeryName?: string | null;
    city?: string | null;
}): string {
    const sName = surgeryName ? ` for ${surgeryName}` : ' medical consultation';
    const cName = city ? ` in ${city}` : '';

    return `Hi ${patientName},

This is HealthExpress India following up on your inquiry${sName}. We have top NABH-accredited partner hospitals${cName} with ₹0 Free OPD consultations, 100% cashless insurance coverage, and 0% EMI.

Please let us know a good time to connect, or reply here if you have any questions.

Best regards,
HealthExpress India Care Team
📞 93078-61041`;
}

export function getSmartLeadWhatsAppDetails({
    patientName,
    phone,
    status,
    opdDate,
    hospitalName,
    hospitalAddress,
    googleMapsUrl,
    surgeryName,
    city,
}: {
    patientName: string;
    phone?: string | null;
    status?: string | null;
    opdDate?: Date | string | null;
    hospitalName?: string | null;
    hospitalAddress?: string | null;
    googleMapsUrl?: string | null;
    surgeryName?: string | null;
    city?: string | null;
}): {
    messageText: string;
    encodedUrl: string;
    buttonTitle: string;
    actionLabel: string;
    isPostOpd: boolean;
} {
    const formattedPhone = formatWhatsAppPhone(phone);
    const leadStatus = status || 'NEW';

    let isOpdTimePassed = false;
    if (opdDate) {
        const d = new Date(opdDate);
        if (!isNaN(d.getTime())) {
            isOpdTimePassed = d.getTime() <= Date.now();
        }
    }

    let messageText = '';
    let buttonTitle = 'Message on WhatsApp';
    let actionLabel = 'WhatsApp';
    let isPostOpd = false;

    // 1. Explicit Post-OPD Done / RNR / Medical Management
    if (leadStatus === 'OPD_DONE') {
        messageText = generatePostOpdFollowUpMessage({ patientName, hospitalName, surgeryName });
        buttonTitle = 'Send Post-OPD Consultation Follow-up on WhatsApp';
        actionLabel = 'Post-OPD Follow-up';
        isPostOpd = true;
    } else if (leadStatus === 'RNR_POST_OPD') {
        messageText = generateRnrPostOpdWhatsAppMessage({ patientName, hospitalName });
        buttonTitle = 'Send Post-OPD RNR Follow-up on WhatsApp';
        actionLabel = 'RNR Follow-up';
        isPostOpd = true;
    } else if (leadStatus === 'SURGERY_SUGGESTED' || leadStatus === 'TENTATIVE_IPD_DATE' || leadStatus === 'PRE_AUTHORIZATION_RAISED') {
        messageText = generateSurgerySuggestedWhatsAppMessage({ patientName, hospitalName, surgeryName });
        buttonTitle = 'Send Surgery & Cashless Insurance Support on WhatsApp';
        actionLabel = 'Surgery Follow-up';
        isPostOpd = true;
    } else if (leadStatus === 'MEDICAL_MANAGEMENT') {
        messageText = generateMedicalManagementWhatsAppMessage({ patientName, hospitalName });
        buttonTitle = 'Send Medical Management Follow-up on WhatsApp';
        actionLabel = 'Follow-up';
        isPostOpd = true;
    } else if (leadStatus === 'OPD_SCHEDULED' || leadStatus === 'OPD_RESCHEDULE') {
        if (isOpdTimePassed) {
            // THE OPD TIME IS DONE! Appointment was in the past, send follow-up instead of pre-arrival confirmation.
            messageText = generatePostOpdFollowUpMessage({ patientName, hospitalName, surgeryName });
            buttonTitle = 'OPD time completed — Send Post-OPD Follow-up on WhatsApp';
            actionLabel = 'Post-OPD Follow-up';
            isPostOpd = true;
        } else {
            // OPD appointment is in the future: send booking confirmation & directions
            messageText = generateOpdWhatsAppMessage({
                patientName,
                hospitalName,
                hospitalAddress,
                googleMapsUrl,
                opdDate,
            });
            buttonTitle = 'Send OPD Appointment Confirmation & Map Directions on WhatsApp';
            actionLabel = 'OPD Confirmation';
            isPostOpd = false;
        }
    } else if (leadStatus === 'FOLLOW_UP') {
        if (isOpdTimePassed && hospitalName) {
            messageText = generatePostOpdFollowUpMessage({ patientName, hospitalName, surgeryName });
            buttonTitle = 'Send Post-OPD Follow-up on WhatsApp';
            actionLabel = 'Post-OPD Follow-up';
            isPostOpd = true;
        } else {
            messageText = generateGeneralFollowUpWhatsAppMessage({ patientName, surgeryName, city });
            buttonTitle = 'Send Follow-up Message on WhatsApp';
            actionLabel = 'Follow-up';
            isPostOpd = false;
        }
    } else {
        messageText = `Hi ${patientName}, this is HealthExpress India regarding your inquiry for ${surgeryName || 'medical consultation'}. We have NABH partner hospitals in ${city || 'your city'} with 100% cashless insurance & 0% EMI. Would you like to check the cost estimate or book a ₹0 doctor OPD consultation?`;
        buttonTitle = 'Send Consultation Welcome Message on WhatsApp';
        actionLabel = 'WhatsApp';
        isPostOpd = false;
    }

    const encodedUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(messageText)}`;

    return {
        messageText,
        encodedUrl,
        buttonTitle,
        actionLabel,
        isPostOpd,
    };
}

