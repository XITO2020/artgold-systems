// lib/dictionaryServerSide.ts
import 'server-only';
import { getDictionary } from './dictionary';
import React from 'react';

interface ServerDictionaryLoaderProps {
  lang: string;
  page: string;
  children: (dict: any) => React.ReactNode;
}

const DictionaryServerSide = async ({ lang, page, children }: ServerDictionaryLoaderProps) => {
  const dict = await getDictionary(lang, page);
  return children(dict);
};

export default DictionaryServerSide;
