import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

interface Props {
  position: Vector3;
  isHarvesting?: boolean;
}

const RocketBooster = ({ position, isHarvesting = false }: Props) => {
  const particleSystemRef = useRef<THREE.Points>(null);

  const [particlePositions, setParticlePositions] = useState<Float32Array>();
  const texture = useTexture(
    isHarvesting ? "/assets/fire.jpg" : "/assets/particle.png"
  );

  useEffect(() => {
    const positions = new Float32Array(900 * 3);
    for (let i = 0; i < 500; i++) {
      positions[i] = (Math.random() - 0.5) * 0.3;
    }
    setParticlePositions(positions);
  }, []);
  function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useFrame(() => {
    if (particleSystemRef.current) {
      const positions = particleSystemRef.current.geometry.attributes.position
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.03;

        const maxLimit = randomIntFromInterval(25, 100);

        if (positions[i + 1] > maxLimit / (isHarvesting ? 40 : 25)) {
          positions[i] = (Math.random() - 0.5) * 0.3;
          positions[i + 1] = 0;
          positions[i + 2] = (Math.random() - 0.5) * 0.2;
        }
      }
      particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!particlePositions) return null;

  return (
    <group position={position} rotation={[-1.55, 0, 0]}>
      <points scale={0.6} ref={particleSystemRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={(particlePositions?.length || 3) / 3}
            itemSize={3}
          />
        </bufferGeometry>

        <pointsMaterial
          attach={"material"}
          color={isHarvesting ? "#FF5F1F" : "none"}
          size={isHarvesting ? 0.2 : 0.8}
          clipShadows
          opacity={isHarvesting ? 0.25 : 0.05}
          map={texture}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default RocketBooster;
