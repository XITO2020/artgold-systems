"use client";

import { useEffect, useState } from 'react';

interface DictionaryLoaderProps {
  lang: string;
  page: string;
  children: (dict: any) => React.ReactNode;
}

export default function DictionaryLoader({ lang, page, children }: DictionaryLoaderProps) {
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const response = await fetch(`/api/dictionary?lang=${lang}&page=${page}`);
        const dict = await response.json();
        setDictionary(dict);
      } catch (error) {
        console.error('Failed to load dictionary:', error);
      }
    };

    loadDictionary();
  }, [lang, page]);

  if (!dictionary) {
    return <div>Loading...</div>;
  }

  return children(dictionary);
}
