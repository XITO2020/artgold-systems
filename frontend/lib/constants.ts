export const GOLD_PRICE_API = 'https://api.metalpriceapi.com/v1/latest';
export const GOLD_PRICE_API_KEY = process.env.METAL_PRICE_API_KEY;

export const TABZ_LIMITS = {
  MAX_VALUE_PER_KG_GOLD: 1, // 1 TABZ = 1 KG Gold value in USD/EUR
  MIN_VALUE: 0.0001, // Minimum TABZ value
};

export const BONUS_SLOTS_CONFIG = {
  THRESHOLD_ARTWORKS: 12,
  THRESHOLD_TABZ: 4000,
  THRESHOLD_AGT: 27000,
  BONUS_SLOTS: 7
};

export const CONVERSION_FEES = {
  TABZ_TO_FIAT: 0.025, // 2.5% fee for converting TABZ to EUR/USD
  TABZ_TO_CRYPTO: 0.015, // 1.5% fee for converting TABZ to crypto
  NETWORK_FEE: 0.001, // 0.1% network fee
};