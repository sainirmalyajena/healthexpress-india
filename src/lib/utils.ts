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
        QUALIFIED: 'bg-green-100 text-green-800',
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
