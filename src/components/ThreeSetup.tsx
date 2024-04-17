import React from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import {
  AccumulativeShadows,
  OrbitControls,
  RandomizedLight,
  Stars,
} from "@react-three/drei";

interface Props {
    children: React.ReactNode
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
        position: [35, 5, -15],
      }}
      style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}
    >
      <EffectComposer>
        <Bloom
          intensity={0.035}
          luminanceThreshold={0.98}
          luminanceSmoothing={0.85}
        />

        <spotLight
          position={[0, 15, 0]}
          angle={30}
          penumbra={5}
          castShadow
          intensity={0.5}
          shadow-bias={-0.0001}
        />
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.5} />
        <Stars radius={5000} count={250} factor={4} saturation={4} />

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
      {children}
    </Canvas>
  );
};

export default ThreeSetup;
