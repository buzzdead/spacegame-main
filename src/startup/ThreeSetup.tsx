import React, { useEffect, useState } from "react";
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
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) || 
               canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true });

    if (!gl) {
      setWebglSupported(false);
    }
  }, []);
  const handleEnableAcceleration = () => {
    alert("To enable hardware acceleration, follow these steps:\n\n" +
          "For Chrome:\n" +
          "1. Go to Settings > Advanced > System\n" +
          "2. Toggle 'Use graphics acceleration when available' to ON\n" +
          "3. Restart Chrome\n\n" +
          "For Firefox:\n" +
          "1. Go to Options > General > Performance\n" +
          "2. Uncheck 'Use recommended performance settings'\n" +
          "3. Check 'Use hardware acceleration when available'\n" +
          "4. Restart Firefox\n\n" +
          "For Edge:\n" +
          "1. Go to Settings > System\n" +
          "2. Toggle 'Use graphics acceleration when available' to ON\n" +
          "3. Restart Edge");
  };
  if (!webglSupported) {
    return (
      <div style={{width: '100%', height: '100%', position: 'absolute', zIndex: 1892732922222237, backgroundColor: 'black'}}>
        <p>Graphics acceleration is disabled or not supported.</p>
        <p>Please enable it for a better experience.</p>
        <button onClick={handleEnableAcceleration}>How to Enable Hardware Acceleration</button>
      </div>
    );
  }
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
    failIfMajorPerformanceCaveat: true
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
