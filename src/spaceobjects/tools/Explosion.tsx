import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { Shader } from "../../postprocessing/Shader";

interface Props {
  position: Vector3;
}

export const Explosion = ({ position }: Props) => {
  const particleSystemRef = useRef<THREE.Points>(null);
  const smokeParticleSystemRef = useRef<THREE.Points>(null);
  const shaderMaterialRef = useRef<any>(null);
  const shaderMaterialRefSmoke = useRef<any>(null);

  const { vs: smokeVS, fs: smokeFS } = Shader("explosion-smoke");
  const { vs: explosionVS, fs: explosionFS } = Shader("explosion");
  const fireTexture = useTexture("/assets/fire1.png");
  const smokeTexture = useTexture("/assets/blackSmoke00.png");
  const pointsMultiplier = useMemo(() => {
    return (
      window.innerHeight / (2.0 * Math.tan((0.5 * 60.0 * Math.PI) / 180.0))
    );
  }, []);
  console.log("starting explosion")
  const numParticles = 1500;
  const numSmokeParticles = 45;
  const {
    particlePositions,
    particleVelocities,
    particleSizes,
    particleAngles,
  } = useMemo(() => {
    const particlePositions = new Float32Array(numParticles * 3);
    const particleVelocities = new Float32Array(numParticles * 3);
    const particleSizes = new Float32Array(numParticles);
    const particleAngles = new Float32Array(numParticles);
    for (let i = 0; i < numParticles; i++) {
      let idx = i * 3;
      // Use spherical coordinates to ensure uniform distribution
      let theta = Math.random() * 2 * Math.PI; // Azimuthal angle
      let phi = Math.acos(2 * Math.random() - 1); // Polar angle
      let radius = Math.random() * 0.05; // Random radius

      // Convert spherical coordinates to Cartesian coordinates
      particlePositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[idx + 2] = radius * Math.cos(phi);

      // Assign velocities to move particles outward from the center
      particleVelocities[idx] = particlePositions[idx] * 0.542; // Scale for speed
      particleVelocities[idx + 1] = particlePositions[idx + 1] * 0.542;
      particleVelocities[idx + 2] = particlePositions[idx + 2] * 0.542;

      particleSizes[i] = Math.random() * 7.5 + 7.5; // Smaller sizes for explosion particles
      particleAngles[i] = Math.random() * Math.PI * 2;
    }
    return {
      particlePositions,
      particleVelocities,
      particleSizes,
      particleAngles,
    };
  }, []);

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
    if (!particleSystemRef.current) return;
    shaderMaterialRef.current.uniforms.uTime.value = THREE.MathUtils.clamp(
      shaderMaterialRef.current.uniforms.uTime.value + 0.001,
      0,
      1
    );
    const geometry = particleSystemRef.current.geometry;
    const positions = geometry.attributes.position.array;
    const velocities = geometry.attributes.velocity.array;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
    }

    particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
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

  if (!particlePositions) return null;

  return (
    <group position={position}>
      <points scale={1} ref={particleSystemRef} renderOrder={0}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={numParticles}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-velocity"
            array={particleVelocities} // Initialize with zeros
            count={numParticles}
            itemSize={3}
          />
          <bufferAttribute
            itemSize={3}
            array={particleSizes}
            count={(particleSizes?.length || 3) / 3}
            attach={"attributes-size"}
          />
          <bufferAttribute
            itemSize={3}
            array={particleAngles}
            count={(particleAngles?.length || 3) / 3}
            attach={"attributes-angle"}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderMaterialRef}
          uniforms={{
            diffuseTexture: { value: fireTexture },
            pointMultiplier: { value: pointsMultiplier },
            uTime: { value: 0.0 },
          }}
          vertexShader={explosionVS}
          fragmentShader={explosionFS}
          transparent
          depthWrite={false}
          depthTest
          vertexColors
          blendEquation={THREE.AddEquation}
          blendSrc={THREE.OneFactor}
          blendDst={THREE.OneMinusSrcAlphaFactor}
          blending={THREE.AdditiveBlending}
        />
      </points>
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
          vertexShader={smokeVS}
          fragmentShader={smokeFS}
          transparent
          depthTest={false}
          depthWrite={false}
          blendEquation={THREE.AddEquation}
          blendSrc={THREE.SrcAlphaFactor}
          blendDst={THREE.OneMinusSrcAlphaFactor}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
// SrcColorFactor ConstantColorFactor
export default Explosion;
