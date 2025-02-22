import { getDictionary } from '~/dictionary';
import HomeClient from 'ç/sections/HomeClient';

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang, 'home');
  return <HomeClient initialDict={dict} lang={lang} />;
}