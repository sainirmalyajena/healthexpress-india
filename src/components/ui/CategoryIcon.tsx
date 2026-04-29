import React from 'react';
import {
    Hospital,
    Bone,
    Droplets,
    Ear,
    Baby,
    Eye,
    Heart,
    Brain,
    Utensils,
    Smile,
    Sparkles,
    Ribbon,
    Stethoscope
} from 'lucide-react';
import { Category } from '@/generated/prisma';

interface CategoryIconProps {
    category: Category | string;
    className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
    const icons: Record<string, React.ElementType> = {
        GENERAL_SURGERY: Hospital,
        ORTHOPEDICS: Bone,
        UROLOGY: Droplets,
        ENT: Ear,
        GYNECOLOGY: Baby,
        OPHTHALMOLOGY: Eye,
        CARDIAC: Heart,
        NEURO: Brain,
        GASTRO: Utensils,
        DENTAL: Smile,
        COSMETIC: Sparkles,
        PEDIATRIC: Baby,
        ONCOLOGY: Ribbon,
    };

    const Icon = icons[category] || Stethoscope;
    return <Icon className={className} />;
}
