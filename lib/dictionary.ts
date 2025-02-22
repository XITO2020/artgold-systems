import 'server-only';

const dictionaries = {
  en: {
    home: () => import('#/locales/en/home.json').then((module) => module.default),
    slider: () => import('#/locales/en/slider.json').then((module) => module.default),
    explore: () => import('#/locales/en/explore.json').then((module) => module.default)
  },
  fr: {
    home: () => import('#/locales/fr/home.json').then((module) => module.default),
    slider: () => import('#/locales/fr/slider.json').then((module) => module.default),
    explore: () => import('#/locales/fr/explore.json').then((module) => module.default)
  }
};

export async function getDictionary(locale: string, page: string = 'home') {
  const lang = locale in dictionaries ? locale : 'fr';

  try {
    const [pageDict, sliderDict] = await Promise.all([
      dictionaries[lang as keyof typeof dictionaries][page as keyof typeof dictionaries.en](),
      dictionaries[lang as keyof typeof dictionaries].slider()
    ]);

    return {
      ...pageDict,
      slider: sliderDict.slider
    };
  } catch (error) {
    console.error(`Error loading dictionary for ${locale}/${page}:`, error);
    // Fallback to French
    const [fallbackDict, fallbackSlider] = await Promise.all([
      dictionaries.fr.home(),
      dictionaries.fr.slider()
    ]);
    
    return {
      ...fallbackDict,
      slider: fallbackSlider.slider
    };
  }
}