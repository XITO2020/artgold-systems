import { getDictionary } from '@lib/dictionary';
import HomeClient from '@comp/sections/HomeClient';

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang, 'home');
  return <HomeClient initialDict={dict} lang={lang} />;
}