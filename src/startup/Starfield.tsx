import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import '../styles/starfield.css'
import { useGLTF } from '@react-three/drei';
import { useAsset } from '../hooks/Asset';

interface Props {
  inGame?: boolean
  theRef?: any
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const ambLight = new THREE.AmbientLight()
ambLight.intensity = 2

const Starfield = ({inGame = false, theRef}: Props) => {
  const starfieldRef = useRef<HTMLDivElement | null>(null);
  const material = new THREE.MeshBasicMaterial({ color: inGame ? "orange" : '#ffffff' });
  const geometry = new THREE.SphereGeometry(0.25, inGame ? 20 : 16, inGame ? 20 : 16);
  const currentThing = useRef(null)
  const pScene = useAsset('/assets/celestialobjects/planet3.glb', 1)
  const bScene = useAsset('/assets/celestialobjects/blackhole.glb', 1)
  
  const cargo = useAsset('/assets/spaceships/cargo2.glb', 0.35)
  const cruiser = useAsset('/assets/spaceships/cruiser.glb', 0.2)
  const fighter = useAsset('/assets/spaceships/fighter.glb', 40)

  fighter.position.set(100,0,-55)
  cargo.position.set(100,0,-65)
  cruiser.position.set(100,0,-55)

  const planetScene = pScene.clone()
  const blackHoleScene = bScene.clone()
  planetScene.position.set( (Math.random() - 0.5) * 300,
  (Math.random() - 0.5) * 300,
  (Math.random()) * 150)
  blackHoleScene.position.set( 
  (Math.random() - 0.5) * 300,
  (Math.random() - 0.5) * 300,
  (Math.random()) * 300)
  planetScene.scale.set(5,5,5)
  blackHoleScene.scale.set(5,5,5)
  !inGame && scene.add(planetScene)
  !inGame && scene.add(blackHoleScene)
  

  useEffect(() => {
    const stars: THREE.Mesh[] = [];

    const createStarfield = () => {
      renderer.setSize(starfieldRef.current!.clientWidth, starfieldRef.current!.clientHeight);
      inGame && renderer.setClearColor("#020d01"); // Set the background color
      starfieldRef.current!.appendChild(renderer.domElement);

      const starCount = 1000;
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
        if(theRef){
        if(theRef.current !== currentThing.current) {
          if(currentThing.current !== null) {
            if(currentThing.current === "Fighter") scene.remove(fighter)
            else if(currentThing.current === "Cargo") scene.remove(cargo)
            else if(currentThing.current === "Cruiser") scene.remove(cruiser)
          }
          if(theRef.current === "Fighter") scene.add(fighter)
            else if(theRef.current === "Cargo") scene.add(cargo)
          else if (theRef.current === "Cruiser") scene.add(cruiser)
          if(theRef.current !== null) {
            scene.add(ambLight)
          }
          else {
            scene.remove(ambLight)
          }
          currentThing.current = theRef.current
        }
        if(currentThing.current === "Fighter") fighter.rotation.y += 0.01
        else if(currentThing.current === "Cargo") cargo.rotation.y += 0.01
        else if (currentThing.current === "Cruiser") cruiser.rotation.y += 0.01
      }
        requestAnimationFrame(animate);
        if (planetScene && !inGame) {
          planetScene.position.z -= 0.1;
          if (planetScene.position.z < -200) {
            planetScene.position.set((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, Math.random() * 150);
          }
        }
        if (blackHoleScene && !inGame) {
          blackHoleScene.position.z -= 0.1;
          if (blackHoleScene.position.z < -200) {
            blackHoleScene.position.set((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300, Math.random() * 300);
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

    return () => {
      // Clean up the Three.js scene and renderer
      stars.forEach(star => {
        star.geometry.dispose();
        (star.material as THREE.Material).dispose();
        scene.remove(star);
      });

      planetScene.traverse((child: any) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });

      blackHoleScene.traverse((child: any) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });

      scene.remove(planetScene);
      scene.remove(blackHoleScene);
      planetScene.removeFromParent()
      blackHoleScene.removeFromParent()
      scene.remove(camera)
      camera.removeFromParent()
      scene.removeFromParent()
      
      if (renderer) {
        renderer.dispose();
        if (starfieldRef.current) {
          starfieldRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, [blackHoleScene, planetScene, scene]);

  return (
    <div ref={starfieldRef} className={inGame ? 'starfield-container2' : 'starfield-container'} />
  );
};

export default Starfield;
