
import React from 'react';
import styles from '@/app/wonderstyles/sitemap.module.css';
import { MapLocation } from '@t/sitemap.ts';

interface MapUIProps {
  hoveredLocation: MapLocation | null;
  selectedLocation: MapLocation | null;
  loadingProgress: number;
}

const MapUI: React.FC<MapUIProps> = ({ 
  hoveredLocation, 
  selectedLocation,
  loadingProgress 
}) => {
  const locations: MapLocation[] = [
    { id: 'central', name: 'Central District', description: 'Blog & News', position: [0, 0, 0] },
    { id: 'port', name: 'Industrial Port', description: 'Portfolio', position: [-10, 0, -5] },
    { id: 'business', name: 'CBD', description: 'NFT Marketplace', position: [5, 0, -3] },
    { id: 'shop', name: 'Small Shop', description: 'Merch Store', position: [8, 0, 4] },
  ];

  return (
    <div className={styles.uiOverlay}>
      {loadingProgress < 100 && (
        <div>Loading: {Math.round(loadingProgress)}%</div>
      )}
      
      {hoveredLocation && (
        <div className={styles.locationTag}>
          <strong>{hoveredLocation.name}</strong>
          <div>{hoveredLocation.description}</div>
        </div>
      )}
      
      {!hoveredLocation && selectedLocation && (
        <div className={styles.locationTag}>
          <strong>Selected: {selectedLocation.name}</strong>
          <div>{selectedLocation.description}</div>
        </div>
      )}
    </div>
  );
};

export default MapUI;