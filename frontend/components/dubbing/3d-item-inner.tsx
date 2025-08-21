"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "@comp/theme/ThemeContext";

// Skeleton 3D: simple rotating cube placeholder (no GLTF required)
function SpinningCube() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"#6cc"} />
    </mesh>
  );
}

const ThreeDItemInner: React.FC = () => {
  const { theme } = useTheme();

  // You can adapt camera/light/materials based on theme here
  const cameraPos = new THREE.Vector3(2.5, 2.5, 2.5);

  return (
    <div style={{ width: "320px", height: "240px" }}>
      <Canvas camera={{ position: cameraPos, fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <SpinningCube />
      </Canvas>
      <p className="mt-2 text-xs opacity-60">Theme actif: {theme}</p>
    </div>
  );
};

export default ThreeDItemInner;
