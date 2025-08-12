"use client";
import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@comp/theme/ThemeContext';

const RotatingModel: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Ajustez la vitesse de rotation ici
    }
  });

  return <primitive ref={meshRef} object={scene} />;
};

const AnimeHeroStyle: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.background = 'transparent';
    }
  }, [theme]);

  // Définir la position de la caméra en fonction du thème
  const getCameraPosition = (theme: string): THREE.Vector3 => {
    switch (theme) {
      case 'dark':
        return new THREE.Vector3(0, 0, 2);
      case 'silver-berry':
        return new THREE.Vector3(0, 0, 3);
      case 'golden-tacos':
        return new THREE.Vector3(0, 0, 2);
      case 'emerald':
        return new THREE.Vector3(2, 0, 0);
      case 'agua-saphir':
        return new THREE.Vector3(0.4, 0, 6);
      case 'chili-ruby':
        return new THREE.Vector3(0, 0, 2);
      case 'light':
        return new THREE.Vector3(0, 0, 2);
      default:
        return new THREE.Vector3(0, 0, 2);
    }
  };

  // Définir le FOV en fonction du thème
  const getCameraFOV = (theme: string): number => {
    switch (theme) {
      case 'dark':
        return 25;
      case 'silver-berry':
        return 5;
      case 'golden-tacos':
        return 50;
      case 'emerald':
        return 40;
      case 'agua-saphir':
        return 45;
      case 'chili-ruby':
        return 20;
      case 'light':
        return 60;
      default:
        return 25;
    }
  };

  return (
    <div style={{ margin:'10px auto', position: 'absolute', width: '20%', height: '15vh', top: '340px', left: '40%', zIndex: 40 }} className="flex flex-col">
      <Canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', position: 'relative' }}
        camera={{ position: getCameraPosition(theme), fov: getCameraFOV(theme), near: 0.1, far: 200 }} // Ajustez la position et le FOV de la caméra ici
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[40, 40, 40]} />
        <RotatingModel url={`/three/models/gem-${theme}/scene.gltf`} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.5}
          panSpeed={0.5}
          rotateSpeed={0.5}
          minDistance={1}
          maxDistance={8}
        />
      </Canvas>
      <p style={{ position: 'relative', zIndex: 80 }} className="w-full text-xs text-center mt-0 opacity-40 text-primary hover:opacity-90 cursor-default">
        Mode {theme} sélectionné
      </p>
    </div>
  );
};

export default AnimeHeroStyle;
