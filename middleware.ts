import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { getCountryFromIP } from '@/lib/geo';

const locales = [
  'en', 'fr', 'es', 'tr', 'ja', 'ar', 'am', 'wo', 'sw', 'it', 'pt',
  'ru', 'cs', 'el', 'ms', 'id', 'th', 'ro', 'ko', 'hi', 'kk', 'ps',
  'ur', 'bn', 'bo', 'de', 'fi', 'is', 'hu', 'sk', 'nl', 'pl', 'se',
  'ga', 'ha', 'xh', 'yo', 'zh', 'zu'
];

const defaultLocale = 'fr';

async function getLocale(request: NextRequest): Promise<string> {
  // Try to get locale from country first
  const countryLocale = await getCountryFromIP();
  if (locales.includes(countryLocale)) {
    return countryLocale;
  }

  // Fall back to browser language preferences
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the pathname starts with a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = await getLocale(request);

    // Special case: if default locale and path is root, don't redirect
    if (locale === defaultLocale && pathname === '/') {
      return NextResponse.next();
    }

    // Redirect to the path with locale
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname === '/' ? '' : pathname}`,
        request.url
      )
    );
  }
  return NextResponse.next();
}