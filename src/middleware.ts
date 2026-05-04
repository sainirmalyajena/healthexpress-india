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

export function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
    const pathname = url.pathname

    // Handle legacy .html paths during transition
    if (pathname.endsWith('.html')) {
        const newPath = pathname.replace(/\.html$/, '') || '/';
        return NextResponse.redirect(new URL(newPath, request.url));
    }

    try {
        // Define domains
        const PRISM_DOMAIN = 'prismhealthcure.com'
        const isPrismDomain = hostname.includes(PRISM_DOMAIN) || hostname.includes('prism-healthcure')
        const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1')

        // 1. Redirect /prism off the main HealthExpress domain to the dedicated domain
        if (!isPrismDomain && !isLocalhost && pathname.includes('/prism')) {
            const newPath = pathname.replace(/^\/[a-z]{2}\/prism/, '').replace(/^\/prism/, '') || '/'
            return NextResponse.redirect(new URL(`https://${PRISM_DOMAIN}${newPath}`, request.url))
        }

        // 2. Handle Prism Domain rewrites
        if (isPrismDomain) {
            // Static assets and internal Next.js paths should NOT be rewritten
            if (
                pathname.startsWith('/_next/') ||
                pathname.startsWith('/api/') ||
                pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|xml|txt)$/)
            ) {
                return
            }

            // Determine locale
            const segments = pathname.split('/')
            const hasLocale = i18n.locales.includes(segments[1] as any)
            const locale = hasLocale ? segments[1] : (getLocale(request) || i18n.defaultLocale)
            
            // Remove locale from pathname for easier processing if it exists
            const pathWithoutLocale = hasLocale ? `/${segments.slice(2).join('/')}` : pathname

            // Rewrite rule: prismhealthcure.com/abc -> /[locale]/prism/abc
            // Except if it already starts with /[locale]/prism
            if (!pathname.startsWith(`/${locale}/prism`)) {
                url.pathname = `/${locale}/prism${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
                
                // Set custom header for layout detection
                const requestHeaders = new Headers(request.headers)
                requestHeaders.set('x-prism-site', 'true')
                
                return NextResponse.rewrite(url, {
                    request: {
                        headers: requestHeaders,
                    }
                })
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
        const shouldBePrism = isPrismDomain || (isLocalhost && pathname.includes('/prism'))
        requestHeaders.set('x-prism-site', shouldBePrism ? 'true' : 'false')

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    } catch (e) {
        console.error('Middleware Error:', e);
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
