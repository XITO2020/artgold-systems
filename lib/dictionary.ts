import 'server-only';

const dictionaries = {
  en: () => import('@/messages/en.json').then((module) => module.default),
  fr: () => import('@/messages/fr.json').then((module) => module.default),
  es: () => import('@/messages/es.json').then((module) => module.default),
  tr: () => import('@/messages/tr.json').then((module) => module.default),
  ja: () => import('@/messages/ja.json').then((module) => module.default),
  ar: () => import('@/messages/ar.json').then((module) => module.default),
  am: () => import('@/messages/am.json').then((module) => module.default),
  wo: () => import('@/messages/wo.json').then((module) => module.default),
  sw: () => import('@/messages/sw.json').then((module) => module.default),
  it: () => import('@/messages/it.json').then((module) => module.default),
  pt: () => import('@/messages/pt.json').then((module) => module.default),
  ru: () => import('@/messages/ru.json').then((module) => module.default),
  cs: () => import('@/messages/cz.json').then((module) => module.default),
  el: () => import('@/messages/gr.json').then((module) => module.default),
  ms: () => import('@/messages/ms.json').then((module) => module.default),
  id: () => import('@/messages/id.json').then((module) => module.default),
  th: () => import('@/messages/th.json').then((module) => module.default),
  ro: () => import('@/messages/ro.json').then((module) => module.default),
  ko: () => import('@/messages/ko.json').then((module) => module.default),
  hi: () => import('@/messages/hi.json').then((module) => module.default),
  kk: () => import('@/messages/kk.json').then((module) => module.default),
  ps: () => import('@/messages/ps.json').then((module) => module.default),
  ur: () => import('@/messages/ur.json').then((module) => module.default),
  bn: () => import('@/messages/bn.json').then((module) => module.default),
  de: () => import('@/messages/de.json').then((module) => module.default),
  fi: () => import('@/messages/fi.json').then((module) => module.default),
  is: () => import('@/messages/is.json').then((module) => module.default),
  hu: () => import('@/messages/hu.json').then((module) => module.default),
  sk: () => import('@/messages/sk.json').then((module) => module.default),
  nl: () => import('@/messages/nl.json').then((module) => module.default),
  pl: () => import('@/messages/pl.json').then((module) => module.default),
  ga: () => import('@/messages/ga.json').then((module) => module.default),
  ha: () => import('@/messages/ha.json').then((module) => module.default),
  xh: () => import('@/messages/xh.json').then((module) => module.default),
  yo: () => import('@/messages/yo.json').then((module) => module.default),
  zh: () => import('@/messages/zh.json').then((module) => module.default),
  zu: () => import('@/messages/zu.json').then((module) => module.default),
  bo: () => import('@/messages/bo.json').then((module) => module.default),
  km: () => import('@/messages/km.json').then((module) => module.default),
  mn: () => import('@/messages/mn.json').then((module) => module.default)
};

export async function getDictionary(locale: string) {
  if (!(locale in dictionaries)) {
    return dictionaries.fr();
  }
  return dictionaries[locale as keyof typeof dictionaries]();
}