import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
        // Revalidate all common paths if no path specified
        revalidatePath('/[lang]/surgeries/[slug]', 'page');
        revalidatePath('/[lang]/[city]/[slug]', 'page');
        revalidatePath('/[lang]/doctors/[id]', 'page');
        return NextResponse.json({ revalidated: true, message: 'Revalidated all dynamic routes' });
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
}
