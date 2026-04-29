import { NextResponse, NextRequest } from 'next/server'
import { i18n } from './i18n-config'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

function getLocale(request: NextRequest): string | undefined {
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))
    const locales: string[] = i18n.locales as unknown as string[]
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)
    const locale = matchLocale(languages, locales, i18n.defaultLocale)
    return locale
}

export function proxy(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''
    const pathname = url.pathname

    // Define domains
    const PRISM_DOMAIN = 'prismhealthcure.com'
    const isPrismDomain = hostname.includes(PRISM_DOMAIN) || hostname.includes('prism-healthcure')
    const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')

    // Handle Prism Domain rewrites
    if (isPrismDomain) {
        if (pathname === '/' || pathname === '/en' || pathname === '/hi') {
            const locale = pathname.startsWith('/') && pathname.length > 1 ? pathname.split('/')[1] : 'en'
            url.pathname = `/${locale}/prism`
            return NextResponse.rewrite(url)
        }
    }

    // Standard HealthExpress Logic
    if (pathname === '/robots.txt' || pathname === '/sitemap.xml') {
        return
    }

    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|xml|txt)$/)
    ) {
        return
    }

    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    if (pathnameIsMissingLocale) {
        const locale = getLocale(request)
        return NextResponse.redirect(
            new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
        )
    }

    // Set custom header for layout detection
    const requestHeaders = new Headers(request.headers)
    // Use Prism shell if on Prism domain OR if path is /prism (for verification on HE domain)
    const shouldBePrism = isPrismDomain || pathname.includes('/prism')
    requestHeaders.set('x-prism-site', shouldBePrism ? 'true' : 'false')

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
