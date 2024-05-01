import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Shader } from "../../postprocessing/Shader";

interface Props {
    pointsMultiplier: number
}

export const Fire = ({pointsMultiplier}: Props) => {
  const particleSystemRef = useRef<THREE.Points>(null);
  const shaderMaterialRef = useRef<any>(null);
  const { vs, fs } = Shader("explosion");
  const fireTexture = useTexture("/assets/fire1.png");
  const numParticles = 1500;
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
  });

  return (
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
        vertexShader={vs}
        fragmentShader={fs}
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
  );
};
