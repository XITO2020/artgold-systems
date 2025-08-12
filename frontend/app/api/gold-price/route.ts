import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { GOLD_PRICE_API, GOLD_PRICE_API_KEY } from '@LIB/constants';
import { TOKEN_CONFIG } from '@LIB/token-config';

// Cache prices for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
let priceCache = {
  gold: 0,
  silver: 0,
  lastUpdated: 0
};

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if we need to update cache
    const now = Date.now();
    if (now - priceCache.lastUpdated > CACHE_DURATION) {
      const response = await fetch(
        `${GOLD_PRICE_API}?api_key=${GOLD_PRICE_API_KEY}&base=USD&currencies=XAU,XAG`
      );
      const data = await response.json();
      
      // Convert troy ounces to grams (1 troy oz = 31.1034768g)
      const goldPricePerGram = data.rates.XAU * 31.1034768;
      const silverPricePerGram = data.rates.XAG * 31.1034768;

      // Update cache
      priceCache = {
        gold: goldPricePerGram,
        silver: silverPricePerGram,
        lastUpdated: now
      };

      // Store in Supabase for historical tracking
      await supabase.from('metal_prices').insert({
        gold_price: goldPricePerGram,
        silver_price: silverPricePerGram,
        timestamp: new Date().toISOString()
      });
    }

    // Calculate token values
    const tabzValue = priceCache.gold * TOKEN_CONFIG.TABZ.goldGramsPerToken;
    const agtValue = priceCache.silver * TOKEN_CONFIG.AGT.silverGramsPerToken;

    return NextResponse.json({
      prices: {
        goldPerGram: priceCache.gold,
        silverPerGram: priceCache.silver,
      },
      tokens: {
        TABZ: {
          usdValue: tabzValue,
          metalBacking: TOKEN_CONFIG.TABZ.goldGramsPerToken,
          metal: 'gold'
        },
        AGT: {
          usdValue: agtValue,
          metalBacking: TOKEN_CONFIG.AGT.silverGramsPerToken,
          metal: 'silver'
        }
      },
      timestamp: priceCache.lastUpdated,
      nextUpdate: priceCache.lastUpdated + CACHE_DURATION
    });
  } catch (error) {
    console.error('Error fetching metal prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metal prices' },
      { status: 500 }
    );
  }
}

// Allow admins to force price update
export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check if user is admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();

    if (!user?.is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Force cache invalidation
    priceCache.lastUpdated = 0;
    
    // Redirect to GET handler
    return GET();
  } catch (error) {
    console.error('Error updating prices:', error);
    return NextResponse.json(
      { error: 'Failed to update prices' },
      { status: 500 }
    );
  }
}