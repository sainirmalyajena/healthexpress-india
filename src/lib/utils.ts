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

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
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

export function formatWhatsAppPhone(phone: string): string {
    const clean = phone.replace(/[^0-9]/g, '');
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

