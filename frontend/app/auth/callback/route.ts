// frontend/app/auth/callback/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  // on ignore tout (ex-code) et on renvoie à l’accueil (localisé si besoin)
  return NextResponse.redirect(url.origin + '/fr');
}
