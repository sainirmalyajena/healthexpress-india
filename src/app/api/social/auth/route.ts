import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const APP_ID = process.env.META_APP_ID;
    
    if (!APP_ID) {
        return NextResponse.json({ error: 'META_APP_ID not configured in .env' }, { status: 500 });
    }

    // Hardcode the redirect URI to guarantee exact match with Meta settings
    const redirectUri = 'https://healthexpressindia.com/api/social/callback';
    
    // Scopes needed for Autobot
    const scopes = [
        'pages_manage_posts',
        'pages_read_engagement',
        'instagram_basic',
        'instagram_content_publish',
        'pages_show_list'
    ].join(',');
    
    // Construct the Facebook OAuth Dialog URL
    const fbLoginUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`;
    
    // Redirect the user to Facebook
    return NextResponse.redirect(fbLoginUrl);
}
