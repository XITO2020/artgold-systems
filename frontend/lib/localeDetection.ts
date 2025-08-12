import { headers } from 'next/headers';

const countryToLanguage: { [key: string]: string } = {
  // English
  GB: 'en', US: 'en', AU: 'en', NZ: 'en',
  
  // French
  FR: 'fr', BE: 'fr', CA: 'fr',
  
  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es',
  
  // German
  DE: 'de', AT: 'de', CH: 'de',
  
  // Arabic
  SA: 'ar', AE: 'ar', EG: 'ar', MA: 'ar',
  
  // Zulu
  ZA: 'zu',
  
  // Hausa
  NG: 'ha', NE: 'ha',
};

export async function getCountryFromIP(): Promise<string> {
  try {
    const headersList = headers();
    const cfCountry = headersList.get('cf-ipcountry');
    
    if (cfCountry && countryToLanguage[cfCountry]) {
      return countryToLanguage[cfCountry];
    }

    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferredLanguage = acceptLanguage.split(',')[0].split('-')[0];
      if (Object.values(countryToLanguage).includes(preferredLanguage)) {
        return preferredLanguage;
      }
    }

    return 'fr'; // Default to French
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'fr';
  }
}

export const SUPPORTED_LOCALES = [
  'fr', // Default first
  'en',
  'es',
  'de',
  'ar',
  'zu',
  'ha'
];

export function isValidLocale(locale: string): boolean {
  return SUPPORTED_LOCALES.includes(locale);
}