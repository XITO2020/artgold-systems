"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const AnimHeroInner = dynamic(() => import('./AnimHeroInner'), {
  ssr: false,
  loading: () => (
    <div
      style={{ margin: '10px auto', position: 'absolute', width: '10%', height: '10vh', top: '0px', right: '-30px', zIndex: 40 }}
      className="flex flex-col"
    />
  ),
});

const AnimeHeroStyle: React.FC = () => {
  return <AnimHeroInner />;
};

export default AnimeHeroStyle;
