import { NextRequest, NextResponse } from 'next/server';
import { signIn, signOut } from '@/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, action } = body;

        if (action === 'logout') {
            await signOut();
            return NextResponse.json({ success: true });
        }

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        try {
            const result = await signIn('admin-login', {
                email,
                password,
                redirect: false,
            });

            if (!result) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            return NextResponse.json({ success: true });
        } catch (authError) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
    } catch (error) {
        console.error('Admin Auth Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE() {
    await signOut();
    return NextResponse.json({ success: true });
}
