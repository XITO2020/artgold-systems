"use client";
import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@comp/theme/ThemeContext';

const RotatingModel: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (meshRef.current) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          switch (theme) {
            case 'diamond-pastel':
              child.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0x9966cc), // Couleur améthyste
                roughness: 0.1, // Très brillant
                metalness: 0.8, // Aspect métallique
              });
              break;
            case 'chili-ruby':
              child.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(0xff0000), // Couleur rubis
                roughness: 0.2, // Moins brillant
                metalness: 0.7, // Aspect métallique
              });
              break;
            // Ajoutez d'autres cas pour d'autres thèmes si nécessaire
            default:
              // Vous pouvez définir un matériau par défaut ici si nécessaire
              break;
          }
        }
      });
    }
  }, [theme, scene]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // vitesse de rotation
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
        return new THREE.Vector3(0, 4, 2);
      case 'diamond-pastel':
        return new THREE.Vector3(0, 0, 2);
      case 'light':
        return new THREE.Vector3(3, 4, 4);
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
        return 3;
      case 'golden-tacos':
        return 30;
      case 'diamond-pastel':
        return 60;
      case 'emerald':
        return 40;
      case 'agua-saphir':
        return 27;
      case 'chili-ruby':
        return 5;
      case 'light':
        return 40;
      default:
        return 25;
    }
  };

  return (
    <div style={{ margin:'10px auto', position: 'absolute', width: '10%', height: '10vh', top: '0px', right: '-30px', zIndex: 40 }} className="flex flex-col">
      <Canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', position: 'relative' }}
        camera={{ position: getCameraPosition(theme), fov: getCameraFOV(theme), near: 0.1, far: 200 }} // Ajustez la position et le FOV de la caméra ici
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[40, 60, 40]} intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.0} />
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
        /> {/*oribit control hs depuis peu */}
      </Canvas>
      <p style={{ position: 'relative', zIndex: 80 }} className="w-full text-xs text-center mt-0 opacity-40 text-muted-foreground hover:opacity-90 cursor-default">
        Mode {theme}
      </p>
    </div>
  );
};

export default AnimeHeroStyle;
