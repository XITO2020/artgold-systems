import { getDictionary } from '@LIB/dictionary';
import BlogClient from '@comp/sections/BlogClient';

export default async function BlogPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang, 'blog');
  return <BlogClient initialDict={dict} lang={lang} />;
}