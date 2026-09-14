import { z } from 'zod';

// Indian phone validation - 10 digits, optionally with +91 prefix
const phoneRegex = /^(\+91)?[6-9]\d{9}$/;

export const leadFormSchema = z.object({
    fullName: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name is too long'),
    phone: z
        .string()
        .regex(phoneRegex, 'Please enter a valid Indian phone number'),
    email: z
        .string()
        .email('Please enter a valid email')
        .optional()
        .or(z.literal('')),
    city: z
        .string()
        .min(2, 'City must be at least 2 characters')
        .max(50, 'City name is too long'),
    surgeryId: z.string().min(1, 'Please select a surgery'),
    surgeryName: z.string().optional(),
    description: z
        .string()
        .min(10, 'Please describe your symptoms in at least 10 characters')
        .max(2000, 'Description is too long'),
    insurance: z.enum(['YES', 'NO', 'NOT_SURE']),
    callbackTime: z.string().optional(),
    consent: z.boolean().refine((val) => val === true, {
        message: 'You must agree to be contacted',
    }),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const contactFormSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().regex(phoneRegex, 'Please enter a valid Indian phone number').optional().or(z.literal('')),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    consent: z.boolean().refine((val) => val === true, {
        message: 'You must agree to be contacted',
    }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
