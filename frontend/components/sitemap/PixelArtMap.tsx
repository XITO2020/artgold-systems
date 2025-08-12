
'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import styles from '@/app/wonderstyles/sitemap.module.css';
import MapUI from './MapUI';
import { MapLocation } from 'T/sitemap.ts;

export default function PixelArtMap() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<MapLocation | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialisation de la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffb142);
    scene.fog = new THREE.FogExp2(0xff8e00, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Contrôles Orbit
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 1.5;

    // Lumière
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Gestion des clics
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        // Ici vous pourriez vérifier si l'objet cliqué correspond à un lieu
        // et déclencher une navigation ou une action
        console.log('Clicked:', clickedObject.name);
      }
    }

    // Gestion du survol
    function onMouseMove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        // Mettre à jour l'état hoveredLocation en fonction de l'objet survolé
      } else {
        setHoveredLocation(null);
      }
    }

    window.addEventListener('click', onMouseClick);
    window.addEventListener('mousemove', onMouseMove);

    // Chargement du modèle GLTF
    const loader = new GLTFLoader();
    loader.load(
      '/models/tabascocity.glb',
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(model);
        setLoadingProgress(100);
      },
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100;
        setLoadingProgress(progress);
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Nettoyage
    return () => {
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('mousemove', onMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={mountRef} className={styles.canvas} />
      <MapUI 
        hoveredLocation={hoveredLocation} 
        selectedLocation={selectedLocation}
        loadingProgress={loadingProgress}
      />
    </>
  );
}