// frontend/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['fr', 'en', 'es', 'de', 'ar', 'zu', 'ha'] as const;
const defaultLocale = 'fr';

// Parse minimal d'Accept-Language → trie par q (qualité) décroissant
function negotiateLocale(accept: string | null, supported: readonly string[], fallback: string) {
  if (!accept) return fallback;

  // ex: "fr-FR,fr;q=0.9,en;q=0.8"
  const parts = accept
    .split(',')
    .map((p) => {
      const [tag, ...params] = p.trim().split(';');
      const q = Number(params.find((x) => x.trim().startsWith('q='))?.split('=')[1] ?? '1');
      return { tag: tag.toLowerCase(), q: isNaN(q) ? 1 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of parts) {
    // 1) match exact (en, fr, es…)
    const exact = supported.find((l) => l.toLowerCase() === tag);
    if (exact) return exact;

    // 2) match préfixe (en-US → en, fr-FR → fr)
    const base = tag.split('-')[0];
    const pref = supported.find((l) => l.toLowerCase() === base);
    if (pref) return pref;
  }
  return fallback;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Laisse passer les assets statiques & l’API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // fichiers (favicon, images…)
  ) {
    return NextResponse.next();
  }

  // Si l’URL contient déjà une langue supportée, on ne fait rien
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  // 1) si cookie de langue déjà présent et valide, on l’utilise
  const cookieLocale =
    request.cookies.get('locale')?.value ||
    request.cookies.get('NEXT_LOCALE')?.value; // compat next-intl/next-themes éventuels
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    const url = request.nextUrl.clone();
    url.pathname = `/${cookieLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // 2) sinon, tentative via Accept-Language, fallback fr
  const headerLocale = negotiateLocale(
    request.headers.get('accept-language'),
    locales,
    defaultLocale
  );

  const url = request.nextUrl.clone();
  url.pathname = `/${headerLocale}${pathname}`;
  // on conserve aussi la query string
  url.search = search;
  return NextResponse.redirect(url);
}

// applique le middleware sur (presque) tout, en excluant _next, static, images, api…
export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
