import { GOLD_PRICE_API, GOLD_PRICE_API_KEY, TABZ_LIMITS } from './constants';

export const TOKEN_CONFIG = {
  TABZ: {
    name: 'TabAsCoin',
    symbol: 'TABZ',
    decimals: 18,
    goldGramsPerToken: 0.0001, // 0.0001g of gold per TABZ
    logo: '/tokens/tabz-logo.svg',
    network: 'solana',
    programId: process.env.NEXT_PUBLIC_TABZ_PROGRAM_ID,
    contractAddress: process.env.NEXT_PUBLIC_TABZ_CONTRACT_ADDRESS,
    minPurchase: 1,
    maxPurchase: 10000,
    lockupPeriod: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
    maxValuePerKgGold: TABZ_LIMITS.MAX_VALUE_PER_KG_GOLD,
    minValue: TABZ_LIMITS.MIN_VALUE
  },
  AGT: {
    name: 'Art Generator Token',
    symbol: 'AGT',
    decimals: 18,
    silverGramsPerToken: 0.001, // 0.001g of silver per AGT
    logo: '/tokens/agt-logo.svg',
    network: 'ethereum',
    contractAddress: process.env.NEXT_PUBLIC_AGT_CONTRACT_ADDRESS,
    minPurchase: 10,
    maxPurchase: 100000,
    minExchangeAmount: 100, // 100 AGT
    exchangeFee: 0.015, // 1.5%
    lockupPeriod: 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
  }
};

export const CONVERSION_RATES = {
  TABZ_TO_ETH: 0.001,  // 1 TABZ = 0.001 ETH
  AGT_TO_ETH: 0.0005,  // 1 AGT = 0.0005 ETH
  TABZ_TO_SOL: 0.01,   // 1 TABZ = 0.01 SOL
  AGT_TO_SOL: 0.005,   // 1 AGT = 0.005 SOL
  EUR_TO_TABZ: 1,      // 1 EUR = 1 TABZ
  EUR_TO_AGT: 2,       // 1 EUR = 2 AGT
};

export const LIMITS = {
  MAX_TABZ_PER_ARTWORK: 1000000,
  MIN_TABZ_PER_ARTWORK: 1,
  MAX_AGT_PER_ARTWORK: 2000000,
  MIN_AGT_PER_ARTWORK: 1,
  LOCKUP_PERIOD: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
};

export async function calculateTokenValues() {
  try {
    const response = await fetch(
      `${GOLD_PRICE_API}?api_key=${GOLD_PRICE_API_KEY}&base=USD&currencies=XAU,XAG`
    );
    const data = await response.json();
    
    // Convert troy ounces to grams (1 troy oz = 31.1034768g)
    const goldPricePerGram = data.rates.XAU * 31.1034768;
    const silverPricePerGram = data.rates.XAG * 31.1034768;

    return {
      TABZ_VALUE: goldPricePerGram * TOKEN_CONFIG.TABZ.goldGramsPerToken,
      AGT_VALUE: silverPricePerGram * TOKEN_CONFIG.AGT.silverGramsPerToken,
      GOLD_PRICE: goldPricePerGram,
      SILVER_PRICE: silverPricePerGram,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error calculating token values:', error);
    return null;
  }
}