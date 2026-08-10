import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
        return NextResponse.redirect(`${url.origin}/en/admin/social?error=${error}`);
    }

    if (!code) {
        return NextResponse.redirect(`${url.origin}/en/admin/social?error=no_code`);
    }

    const APP_ID = process.env.META_APP_ID;
    const APP_SECRET = process.env.META_APP_SECRET;
    const redirectUri = `${url.origin}/api/social/callback`;

    try {
        // 1. Exchange code for Short-Lived User Token
        const tokenRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${APP_SECRET}&code=${code}`);
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
            console.error('Short-lived token error:', tokenData.error);
            return NextResponse.redirect(`${url.origin}/en/admin/social?error=token_exchange`);
        }

        const shortLivedToken = tokenData.access_token;

        // 2. Exchange Short-Lived User Token for Long-Lived User Token
        const longLivedRes = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${shortLivedToken}`);
        const longLivedData = await longLivedRes.json();

        if (longLivedData.error) {
            console.error('Long-lived token error:', longLivedData.error);
            return NextResponse.redirect(`${url.origin}/en/admin/social?error=long_lived_exchange`);
        }

        const longLivedUserToken = longLivedData.access_token;

        // 3. Get the Page Access Token
        const accountsRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${longLivedUserToken}`);
        const accountsData = await accountsRes.json();

        if (accountsData.error || !accountsData.data || accountsData.data.length === 0) {
            console.error('Accounts fetch error:', accountsData.error || 'No pages found');
            return NextResponse.redirect(`${url.origin}/en/admin/social?error=no_pages`);
        }

        // Find HealthExpress India page
        let targetPage = accountsData.data.find((p: any) => p.name.includes('HealthExpress'));
        
        // Fallback to the first page if exact name not matched
        if (!targetPage) {
            targetPage = accountsData.data[0];
        }

        const pageAccessToken = targetPage.access_token;
        const pageId = targetPage.id;

        // 4. Save to Database
        await prisma.systemSetting.upsert({
            where: { key: 'META_PAGE_ACCESS_TOKEN' },
            update: { value: pageAccessToken },
            create: { key: 'META_PAGE_ACCESS_TOKEN', value: pageAccessToken }
        });
        
        await prisma.systemSetting.upsert({
            where: { key: 'META_PAGE_ID' },
            update: { value: pageId },
            create: { key: 'META_PAGE_ID', value: pageId }
        });

        // Try to fetch Instagram Account ID if linked
        const igRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`);
        const igData = await igRes.json();
        
        if (igData.instagram_business_account) {
            const igId = igData.instagram_business_account.id;
            await prisma.systemSetting.upsert({
                where: { key: 'META_IG_ACCOUNT_ID' },
                update: { value: igId },
                create: { key: 'META_IG_ACCOUNT_ID', value: igId }
            });
        }

        return NextResponse.redirect(`${url.origin}/en/admin/social?success=true`);

    } catch (e) {
        console.error('OAuth Callback Error:', e);
        return NextResponse.redirect(`${url.origin}/en/admin/social?error=server_error`);
    }
}
