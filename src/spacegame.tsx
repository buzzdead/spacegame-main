import React, { useRef, useState } from "react";
import useStore from "./store/useStore";
import { Canvas, useFrame } from "@react-three/fiber";
import CelestialObject from "./spaceobjects/CelestialObject";
import { LayerMaterial, Color, Depth } from "lamina";
import { BackSide, Group, Object3DEventMap, CubeTextureLoader } from "three";
import { EffectComposer, Bloom, LensFlare, LensFlareEffect } from '@react-three/postprocessing'

import {
  AccumulativeShadows,
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  OrthographicCamera,
  PerformanceMonitor,
  PerspectiveCamera,
  RandomizedLight,
  Sky,
  Stars,
} from "@react-three/drei";

import Ship from "./spaceobjects/Ship";
import Construction from "./spaceobjects/Construction";

interface Props {
  startPlanet: "planet1" | "planet2" | "planet3" | 'planet5' | 'planet6';
  startShip: "hullspaceship" | "spaceship-evil" | "cargo";
}

const SpaceGame: React.FC<Props> = ({ startPlanet, startShip }) => {
  const loader = new CubeTextureLoader();
  const texture = loader.load(['/assets/starmap.jpg'])
  const [degrade, setDegrade] = useState(false);
  const celestialObjects = useStore((state) => state.celestialObjects).filter(
    (co) => co.id === startPlanet || co.id === "asteroid" || co.id === "asteroid-minerals" || co.id === 'blackhole'
  );
  const ships = useStore((state) => state.ships).filter(
    (ship) => ship.id === startShip
  );
  const constructions = useStore((state) => state.constructions).filter(
    (c) =>  c.id === "spacestation3")
    const aspect = window.innerWidth / window.innerHeight;
    const zoom = 100; // Adjust as needed for starfield density
    
    const frustumHeight = 2 * zoom; // Assuming zoom behaves similarly to FOV
    const frustumWidth = frustumHeight * aspect;
    
    const left = -frustumWidth 
    const right = frustumWidth 
    const top = frustumHeight 
    const bottom = -frustumHeight 
  return (
    <Canvas
    camera={{left: left, right: right, top: top, bottom: bottom, far: 40000, near: 0.1}}
      style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}
    >
      <EffectComposer>
    <Bloom 
        intensity={.2} 
        luminanceThreshold={.8} 
        luminanceSmoothing={0.5}
    />

      <spotLight
        position={[0, 15, 0]}
        angle={30}
        penumbra={5}
        castShadow
        intensity={0.5}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={.5} />
      <directionalLight intensity={.5}/>
      <Stars radius={5000} count={1500} factor={4} saturation={1} />
      
      <OrbitControls />

    
      <AccumulativeShadows
        position={[0, -1.16, 0]}
        frames={100}
        alphaTest={0.9}
        scale={10}
      >
        <RandomizedLight
          amount={8}
          radius={55}
          ambient={0.5}
          position={[1, 5, -1]}
        />
      </AccumulativeShadows>
    
</EffectComposer>
      
{celestialObjects.map((co) => (
        <CelestialObject key={co.id} celestialObject={co} />
      ))}
      {ships.map((ship) => (
        <Ship key={ship.id} ship={ship} />
      ))}
      {constructions.map((c) => (
        <Construction key={c.id} construction={c} />
      ))}
    </Canvas>
  );
};

function Lightformers({ positions = [2, 0, 2, 0, 2, 0, 2, 0] }) {
  const groupRef = useRef<Group<Object3DEventMap>>(null);
  useFrame((state, delta) => {
    if(!groupRef.current) return
    (groupRef.current.position.z += delta * 10) > 20 &&
      (groupRef.current.position.z = -60);
  });
  return (
  
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <LayerMaterial side={BackSide}>
          <Color color="#444" alpha={1} mode="normal" />
          <Depth
            colorA="black"
            colorB="black"
            alpha={0.85}
            mode="multiply"
            near={0}
            far={300}
            origin={[100, 100, 100]}
          />
        </LayerMaterial>
      </mesh>
  );
}

export default SpaceGame;
