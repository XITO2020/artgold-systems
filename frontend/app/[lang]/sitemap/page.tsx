
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import styles from '../../wonderstyles/sitemap.module.css';

// Chargement dynamique avec SSR désactivé pour Three.js
const PixelArtMap = dynamic(
  () => import('@comp/sitemap/PixelArtMap'),
  { 
    ssr: false,
    loading: () => <div className={styles.loading}>Loading TabascoCity...</div>
  }
);

export default function SitemapPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div className={styles.loading}>Initializing 3D Engine...</div>}>
        <PixelArtMap />
      </Suspense>
    </div>
  );
}