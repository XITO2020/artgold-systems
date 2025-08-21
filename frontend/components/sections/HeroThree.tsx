"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const HeroThreeInner = dynamic(() => import('./HeroThreeInner'), {
  ssr: false,
  loading: () => null,
});

const AnimeHeroStyle: React.FC = () => {
  return <HeroThreeInner />;
};

export default AnimeHeroStyle;
