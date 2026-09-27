import { Resend } from 'resend';
import { prisma } from './prisma';

export async function getResendClient(overrideKey?: string) {
    if (overrideKey && overrideKey.trim()) {
        return new Resend(overrideKey.trim());
    }

    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: 'RESEND_API_KEY' }
        });
        if (setting?.value && setting.value.trim()) {
            return new Resend(setting.value.trim());
        }
    } catch {
        // Database query fallback
    }

    return new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
}

export const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
