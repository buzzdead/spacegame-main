import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

interface Props {
  position: Vector3;
}

export const Explosion = ({ position }: Props) => {
  const particleSystemRef = useRef<THREE.Points>(null);
  const colors = [
    new THREE.Color("#ea5104"),
    new THREE.Color("#470b04"),
    new THREE.Color("#a40e04"),
    new THREE.Color("#fb7604"),
    new THREE.Color("#740a04"),

    new THREE.Color("#fca204"),
    new THREE.Color("#ba0b04"),
    new THREE.Color("#a40e04"),
    new THREE.Color("#cb2004"),
    new THREE.Color("#c93204"),
  ];

  const particleColors = new Float32Array(500 * 3);
  for (let i = 0; i < 500; i++) {
    const colorIndex = Math.floor(Math.random() * colors.length);
    particleColors[i * 3] = colors[colorIndex].r;
    particleColors[i * 3 + 1] = colors[colorIndex].g;
    particleColors[i * 3 + 2] = colors[colorIndex].b;
  }
  const [particlePositions, setParticlePositions] = useState<Float32Array>();

  const texture = useTexture("/assets/fire.jpg");

  useEffect(() => {
    const initializeParticles = () => {
      const positions = new Float32Array(500 * 3);
      for (let i = 0; i < 500; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }
      setParticlePositions(positions);
    };
    initializeParticles();
  }, []);

  useFrame(() => {
    const updateParticles = () => {
      if (
        particleSystemRef.current &&
        particleSystemRef.current.geometry.attributes.position &&
        particleSystemRef.current.geometry.attributes.velocity
      ) {
        const positions = particleSystemRef.current.geometry.attributes.position
          .array as Float32Array;
        const velocities = particleSystemRef.current.geometry.attributes
          .velocity.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          // Calculate the direction from the center of the explosion
          const direction = new Vector3(
            positions[i],
            positions[i + 1],
            positions[i + 2]
          ).normalize();

          // Apply a force in the direction of the explosion
          velocities[i] += direction.x * 0.0001 + (Math.random() - 0.5) * 0.001;
          velocities[i + 1] +=
            direction.y * 0.0001 + (Math.random() - 0.5) * 0.001;
          velocities[i + 2] +=
            direction.z * 0.0001 + (Math.random() - 0.5) * 0.001;

          velocities[i] *= 0.999; // Add a damping factor

          // Update the position of the particle
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];
          const material = particleSystemRef.current.material;
          if (material instanceof THREE.Material && material.opacity > 0.0025) {
            material.opacity -= 0.0000025;
          }
          // Check if the particle has reached the edge of the explosion
          const maxLimit = 50;
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate =
          true;
        particleSystemRef.current.geometry.attributes.velocity.needsUpdate =
          true;
      }
    };
    updateParticles();
  });

  if (!particlePositions) return null;

  return (
    <group position={position}>
      <points scale={1} ref={particleSystemRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={(particlePositions?.length || 3) / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-velocity"
            array={new Float32Array(1000 * 3)} // Initialize with zeros
            count={(500 * 3) / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={particleColors}
            count={(particleColors?.length || 3) / 3}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          attach={"material"}
          vertexColors
          size={25.5}
          clipShadows
          opacity={0.5}
          map={texture}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default Explosion;
