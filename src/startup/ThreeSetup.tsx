import React from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Environment } from "@react-three/drei";

interface Props {
  children: React.ReactNode;
}

const ThreeSetup = ({ children }: Props) => {
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
    onCreated={({ gl }) => {
      gl.toneMapping = ACESFilmicToneMapping;
    }}
    gl={{
      antialias: false,
    alpha: false,
    powerPreference: "high-performance",
    stencil: true,
    depth: true,
    }}
      camera={{
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        far: 60000,
        fov: 60,
        near: 0.1,
        position: [55, 5, -225],
      }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <Environment
        encoding={3001}
        backgroundIntensity={0.3}
        files={"./starmap-min.jpg"}
        background
      />
      <EffectComposer>
        <Bloom
          intensity={0.035}
          luminanceThreshold={0.98}
          luminanceSmoothing={0.85}
        />
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.5} />
      </EffectComposer>
      {children}
    </Canvas>
  );
};

export default ThreeSetup;
