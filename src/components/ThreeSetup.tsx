import React from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import {
  AccumulativeShadows,
  Environment,
  EnvironmentMap,
  OrbitControls,
  RandomizedLight,
  Stars,
  useEnvironment
} from "@react-three/drei";

import * as THREE from 'three'

interface Props {
    children: React.ReactNode
}

function Background() {
  
}

const ThreeSetup = ({children}: Props) => {
  const aspect = window.innerWidth / window.innerHeight;
  const zoom = 100; // Adjust as needed for starfield density
  const frustumHeight = 2 * zoom; // Assuming zoom behaves similarly to FOV
  const frustumWidth = frustumHeight * aspect;
  const left = -frustumWidth;
  const right = frustumWidth;
  const top = frustumHeight;
  const bottom = -frustumHeight;
  return (
    <Canvas
      camera={{
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        far: 40000,
        near: 0.1,
        position: [35, 5, -125],
      }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <Environment backgroundIntensity={0.3} files={'./starmap-min.jpg'} background />
      <EffectComposer>
        <Bloom
          intensity={0.035}
          luminanceThreshold={0.98}
          luminanceSmoothing={0.85}
        />
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.5} />
        <OrbitControls />
      </EffectComposer>
      {children}
    </Canvas>
  );
};

export default ThreeSetup;
