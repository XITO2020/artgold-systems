import { headers } from 'next/headers';

const countryToLanguage: { [key: string]: string } = {
  // Anglais
  GB: 'en', US: 'en', AU: 'en', NZ: 'en',
  
  // Français
  FR: 'fr', BE: 'fr', CH: 'fr', CA: 'fr',
  
  // Espagnol
  ES: 'es', MX: 'es', AR: 'es', CO: 'es',
  
  // Other languages...
  // Add all your language mappings here
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

    return 'fr';
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'fr';
  }
}