// frontend/app/api/gold-price/route.ts
import { NextResponse } from 'next/server';
import { GOLD_PRICE_API, GOLD_PRICE_API_KEY } from '@lib/constants';
import { TOKEN_CONFIG } from '@lib/token-config';

const API = process.env.NEXT_PUBLIC_API_BASE!; // ex: http://localhost:4000

// Cache 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
type PriceCache = { gold: number; silver: number; lastUpdated: number };
let priceCache: PriceCache = { gold: 0, silver: 0, lastUpdated: 0 };

export async function GET() {
  try {
    const now = Date.now();
    if (now - priceCache.lastUpdated > CACHE_DURATION) {
      const resp = await fetch(
        `${GOLD_PRICE_API}?api_key=${GOLD_PRICE_API_KEY}&base=USD&currencies=XAU,XAG`
      );
      if (!resp.ok) {
        return NextResponse.json({ error: 'upstream_failed' }, { status: 502 });
      }
      const data = await resp.json();

      // NB: on conserve ta logique initiale (XAU * 31.1034768)
      // même si "USD par gramme" devrait être XAU / 31.1034768.
      const TOZ = 31.1034768;
      const goldPerGram = data.rates.XAU * TOZ;
      const silverPerGram = data.rates.XAG * TOZ;

      priceCache = { gold: goldPerGram, silver: silverPerGram, lastUpdated: now };
    }

    const tabzValue = priceCache.gold * TOKEN_CONFIG.TABZ.goldGramsPerToken;
    const agtValue  = priceCache.silver * TOKEN_CONFIG.AGT.silverGramsPerToken;

    return NextResponse.json({
      prices: {
        goldPerGram: priceCache.gold,
        silverPerGram: priceCache.silver,
      },
      tokens: {
        TABZ: {
          usdValue: tabzValue,
          metalBacking: TOKEN_CONFIG.TABZ.goldGramsPerToken,
          metal: 'gold',
        },
        AGT: {
          usdValue: agtValue,
          metalBacking: TOKEN_CONFIG.AGT.silverGramsPerToken,
          metal: 'silver',
        },
      },
      timestamp: priceCache.lastUpdated,
      nextUpdate: priceCache.lastUpdated + CACHE_DURATION,
    });
  } catch (error) {
    console.error('Error fetching metal prices:', error);
    return NextResponse.json({ error: 'Failed to fetch metal prices' }, { status: 500 });
  }
}

// Force refresh (admin seulement)
export async function POST(request: Request) {
  try {
    // Forward des cookies du navigateur vers ton backend
    const cookieHeader = request.headers.get('cookie') ?? '';

    const meRes = await fetch(`${API}/auth/me`, {
      method: 'GET',
      headers: { cookie: cookieHeader },
      credentials: 'include',
    });

    if (!meRes.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const me = await meRes.json();
    if (!me?.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Invalidate cache
    priceCache.lastUpdated = 0;

    // Re-servez le GET (rafraîchi)
    return GET();
  } catch (error) {
    console.error('Error updating prices:', error);
    return NextResponse.json({ error: 'Failed to update prices' }, { status: 500 });
  }
}
