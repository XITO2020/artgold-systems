import { headers } from 'next/headers';

const countryToLanguage: { [key: string]: string } = {
  // Anglais
  GB: 'en', US: 'en', AU: 'en', NZ: 'en',
  
  // Français
  FR: 'fr', BE: 'fr', CH: 'fr', CA: 'fr',
  
  // Espagnol
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', VE: 'es', PE: 'es', CL: 'es', UY: 'es',
  
  // Turc
  TR: 'tr',
  
  // Japonais
  JP: 'ja',
  
  // Arabe
  SA: 'ar', AE: 'ar', EG: 'ar', TN: 'ar', IQ: 'ar', JO: 'ar', OM: 'ar', ER: 'ar', IR: 'ar',  
  
  // Amharique
  ET: 'am',
  
  // Wolof
  SN: 'wo', GM: 'wo', MA: 'wo',
  
  // Swahili
  KE: 'sw', TZ: 'sw', UG: 'sw',

  // Italien
  IT: 'it', SM: 'it',
  
  // Portugais
  BR: 'pt', PT: 'pt', AO: 'pt', JM: 'pt', ST: 'pt', 
  
  // Russe
  RU: 'ru', AM: 'ru', AZ: 'ru',  BY: 'ru', EE: 'ru', LV: 'ru', LT: 'ru', KG: 'ru', UA: 'ru', UZ: 'ru', MV: 'ru', TJ: 'ru', TM: 'ru', 
  
  // Tchèque
  CZ: 'cs',

  // Grec
  GR: 'el', CY: 'el',

  // Malaisien
  MY: 'ms',

  // Indonésien
  ID: 'id',

  // Thaïlandais
  TH: 'th',

  // Roumain
  RO: 'ro', MD: 'ro',

  // Coréen
  KR: 'ko',

  // Hindi
  IN: 'hi',

  // Kazakh
  KZ: 'kk',

  // Pachto
  AF: 'ps',

  // Ourdou
  PK: 'ur',

  // Bengali
  BD: 'bn',

  // Tibétain
  BT: 'bo',

  // Allemand
  DE: 'de', AT: 'de', LI: 'de', NA: 'de',

  // Finnois
  FI: 'fi',

  // Islandais
  IS: 'is',

  // Hongrois
  HU: 'hu',

  // Slovaque
  SK: 'sk',

  // Néerlandais
  NL: 'nl', AN: 'nl',  

  // Polonais
  PL: 'pl',

  // Suédois
  SE: 'se',

  // Irlandais
  IE: 'ga',

  // Haoussa
  NE: 'ha', NG: 'ha',

  // Xhosa
  ZM: 'xh', IL: 'xh',

  // Yoruba
  TO: 'yo', BJ: 'yo', SZ: 'yo', 

  // Chinois
  CN: 'zh',

  // Zoulou
  MZ: 'zu', LS: 'zu', ZA: 'zu', MW: 'zu', 
};

export async function getCountryFromIP(): Promise<string> {
  try {
    const headersList = headers();
    const cfCountry = headersList.get('cf-ipcountry');
    
    // Log the detected country for debugging
    console.log('Country detected from cf-ipcountry header:', cfCountry);

    // Check if cfCountry exists and is mapped in our dictionary
    if (cfCountry && countryToLanguage[cfCountry]) {
      return countryToLanguage[cfCountry];
    } else {
      console.log('No valid country detected, defaulting to fr');
    }

    // Fallback to Accept-Language header if cf-ipcountry is not valid
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferredLanguage = acceptLanguage.split(',')[0].split('-')[0];
      if (Object.values(countryToLanguage).includes(preferredLanguage)) {
        return preferredLanguage;
      }
    }

    // Fallback final : utilise 'fr' comme langue par défaut si aucune information n'est disponible
    return 'fr';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'fr'; // Fallback en cas d'erreur
  }
}
