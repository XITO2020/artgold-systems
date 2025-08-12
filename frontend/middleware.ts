import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { getCountryFromIP } from '~/localeDetection';

const locales = ['fr', 'en', 'es', 'de', 'ar', 'zu', 'ha'];
const defaultLocale = 'fr';

async function getLocale(request: NextRequest): Promise<string> {
  const countryLocale = await getCountryFromIP();
  if (locales.includes(countryLocale)) {
    return countryLocale;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and auth callback
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/auth/callback' ||
    pathname.startsWith('/auth/signin')
  ) {
    return NextResponse.next();
  }

  // Check if pathname starts with a locale
  const hasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    const locale = await getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)']
};