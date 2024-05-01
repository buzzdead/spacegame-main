import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Shader } from "../../postprocessing/Shader";

interface Props {
  pointsMultiplier: number;
}

export const Smoke = ({ pointsMultiplier }: Props) => {
  const smokeParticleSystemRef = useRef<THREE.Points>(null);
  const shaderMaterialRefSmoke = useRef<any>(null);
  const { vs, fs } = Shader("explosion-smoke");
  const smokeTexture = useTexture("/assets/blackSmoke00.png");
  const numSmokeParticles = 45;
  const { smokePositions, smokeVelocities, smokeSizes, smokeLifetimes } =
    useMemo(() => {
      const smokePositions = new Float32Array(numSmokeParticles * 3);
      const smokeVelocities = new Float32Array(numSmokeParticles * 3);
      const smokeSizes = new Float32Array(numSmokeParticles);
      const smokeLifetimes = new Float32Array(numSmokeParticles);
      for (let i = 0; i < numSmokeParticles; i++) {
        let idx = i * 3;
        // Use spherical coordinates to ensure uniform distribution
        let theta = Math.random() * 2 * Math.PI; // Azimuthal angle
        let phi = Math.acos(2 * Math.random() - 1); // Polar angle
        let radius = Math.random() * 0.055; // Random radius
        smokePositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
        smokePositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
        smokePositions[idx + 2] = radius * Math.cos(phi);
        smokeVelocities[idx] = smokePositions[idx] * 0.662; // Scale for speed
        smokeVelocities[idx + 1] = smokePositions[idx + 1] * 0.662;
        smokeVelocities[idx + 2] = smokePositions[idx + 2] * 0.662;
        smokeSizes[i] = Math.random() * 13 + 6.5; // Larger sizes for smoke
        smokeLifetimes[i] = Math.random() * 0.2 + 1; // Longer lifetimes for smoke
      }
      return { smokePositions, smokeVelocities, smokeSizes, smokeLifetimes };
    }, []);

  useFrame(({ clock }) => {
    if (!smokeParticleSystemRef.current) return;
    const smokeGeometry = smokeParticleSystemRef.current.geometry;
    const smokePositions = smokeGeometry.attributes.position.array;
    const smokeVelocities = smokeGeometry.attributes.velocity.array;
    const smokeLifetimes = smokeGeometry.attributes.lifetime.array;
    shaderMaterialRefSmoke.current.uniforms.uTime.value = THREE.MathUtils.clamp(
      shaderMaterialRefSmoke.current.uniforms.uTime.value + 0.0014,
      0,
      1
    );

    for (let i = 0; i < smokePositions.length; i += 3) {
      if (smokeLifetimes[i / 3] > 0) {
        smokePositions[i] += smokeVelocities[i] * 1.25;
        smokePositions[i + 1] += smokeVelocities[i + 1] * 1.25;
        smokePositions[i + 2] += smokeVelocities[i + 2] * 1.25;
        smokeLifetimes[i / 3] -= clock.getDelta(); // Decrease lifetime by the elapsed time
      } else {
        // Reset particle logic can go here
      }
    }
    smokeParticleSystemRef.current.geometry.attributes.position.needsUpdate =
      true;
    smokeParticleSystemRef.current.geometry.attributes.lifetime.needsUpdate =
      true;
  });

  return (
    <points ref={smokeParticleSystemRef} scale={1} renderOrder={1}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach={"attributes-position"}
          array={smokePositions}
          count={numSmokeParticles}
          itemSize={3}
        />
        <bufferAttribute
          attach={"attributes-velocity"}
          array={smokeVelocities}
          count={numSmokeParticles}
          itemSize={3}
        />
        <bufferAttribute
          attach={"attributes-size"}
          array={smokeSizes}
          count={numSmokeParticles}
          itemSize={1}
        />
        <bufferAttribute
          attach={"attributes-lifetime"}
          array={smokeLifetimes}
          count={numSmokeParticles}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderMaterialRefSmoke}
        attach="material"
        uniforms={{
          diffuseTexture: { value: smokeTexture },
          pointMultiplier: { value: pointsMultiplier },
          uTime: { value: 0.0 },
        }}
        vertexShader={vs}
        fragmentShader={fs}
        transparent
        depthTest={false}
        depthWrite={false}
        blendEquation={THREE.AddEquation}
        blendSrc={THREE.SrcAlphaFactor}
        blendDst={THREE.OneMinusSrcAlphaFactor}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
