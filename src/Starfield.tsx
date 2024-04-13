import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from  'three/examples/jsm/loaders/GLTFLoader';
import './styles/starfield.css'
import { useGLTF } from '@react-three/drei';

const Starfield: React.FC = () => {
  const starfieldRef = useRef<HTMLDivElement | null>(null);
  const scene = new THREE.Scene();
  const { scene: planetScene } = useGLTF('/assets/celestialobjects/planet3.glb')
  const { scene: blackHoleScene } = useGLTF('/assets/celestialobjects/blackhole.glb')
  planetScene.position.set( (Math.random() - 0.5) * 300,
  (Math.random() - 0.5) * 300,
  (Math.random()) * 150)
  blackHoleScene.position.set( 
  (Math.random() - 0.5) * 300,
  (Math.random() - 0.5) * 300,
  (Math.random()) * 300)
  planetScene.scale.set(5,5,5)
  blackHoleScene.scale.set(5,5,5)
  scene.add(planetScene)
  scene.add(blackHoleScene)
  

  useEffect(() => {
    const createStarfield = () => {
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(starfieldRef.current!.clientWidth, starfieldRef.current!.clientHeight);
      starfieldRef.current!.appendChild(renderer.domElement);

      const geometry = new THREE.SphereGeometry(0.25, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: '#ffffff' });

      const starCount = 1000;
      const stars: THREE.Mesh[] = [];
      for (let i = 0; i < starCount; i++) {
        const star = new THREE.Mesh(geometry, material);
        const x = (Math.random() - 0.5) * 1000;
        const y = (Math.random() - 0.5) * 1000;
        const z = (Math.random() - 0.5) * 1000;
        star.position.set(x, y, z);
        stars.push(star);
        scene.add(star);
      }

      camera.position.z = 50;

      const animate = () => {
        requestAnimationFrame(animate);
        if (planetScene) {
          planetScene.position.z -= 0.1; 
          if (planetScene.position.z < -200) {
            planetScene.position.set( (Math.random() - 0.5) * 300,
            (Math.random() - 0.5) * 300,
            (Math.random()) * 150)
          }
        }
        if (blackHoleScene) {
          blackHoleScene.position.z -= 0.1; 
          if (blackHoleScene.position.z < -200) {
            blackHoleScene.position.set( 
              (Math.random() - 0.5) * 300,
              (Math.random() - 0.5) * 300,
              (Math.random()) * 300)
          }
        }
        stars.forEach(star => {
          star.position.z -= 0.1;
          if (star.position.z < -500) {
            star.position.z = 500;
          }
        });

        renderer.render(scene, camera);
      };

      animate();
    };

    if (starfieldRef.current) {
      createStarfield();
    }
  }, []);

  return (
    <div ref={starfieldRef} className='starfield-container' />
  );
};

export default Starfield;
