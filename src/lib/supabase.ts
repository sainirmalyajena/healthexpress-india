import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. File uploads will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Uploads a base64 file to Supabase Storage
 */
export async function uploadDocument(
    base64Data: string,
    fileName: string,
    contentType: string,
    bucket: string = 'medical-documents'
): Promise<string | null> {
    try {
        // Convert base64 to Buffer/Blob
        const buffer = Buffer.from(base64Data.split(',')[1] || base64Data, 'base64');

        // Generate a unique file path
        const fileExt = fileName.split('.').pop();
        const path = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, buffer, {
                contentType,
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return publicUrl;
    } catch (error) {
        console.error('Supabase Upload Error:', error);
        return null;
    }
}
