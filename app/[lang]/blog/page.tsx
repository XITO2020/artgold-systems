import { getDictionary } from '~/dictionary';
import BlogClient from 'ç/sections/BlogClient';

export default async function BlogPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang, 'blog');
  return <BlogClient initialDict={dict} lang={lang} />;
}