import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { ParticleSystem } from "./particlesystem";

interface Props {
  position: Vector3;
  cruiser?: boolean
  brake?: boolean;
  isHarvesting?: boolean;
}

const RocketBooster = ({ position, brake = false, isHarvesting = false, cruiser = false }: Props) => {
  const particleSystemRef = useRef<THREE.Points>(null);
  const [particlePositions, setParticlePositions] = useState<Float32Array>();

  const texture = useTexture(
    isHarvesting ? "/assets/fire.jpg" : cruiser ? '/assets/particle.png' : "/assets/fire.jpg"
  );

  useEffect(() => {
    const initializeParticles = () => {
      const positions = new Float32Array(100 * 3);
      for (let i = 0; i < 100; i++) {
        positions[i] = (Math.random() - 0.5) * 0.3;
      }
      setParticlePositions(positions);
    };
    initializeParticles();
  }, []);

  useFrame(() => {
    const updateParticles = () => {
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += isHarvesting ? 0.03 : 0.1;

          const maxLimit = randomIntFromInterval(isHarvesting ? 25 : 0, cruiser ? 200 : 100);

          if ((positions[i + 1] > maxLimit / (isHarvesting ? 40 : 5)) || brake) {
            positions[i] = (Math.random() - 0.5) * 0.3;
            positions[i + 1] = 0;
            positions[i + 2] = (Math.random() - 0.5) * 0.2;
          }
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }
    };
    updateParticles();
  });

  if (!particlePositions) return null;

  return (
    <group position={position} rotation={[-1.55, 0, 0]}>
      <points scale={isHarvesting ? 0.6 : 0.9} ref={particleSystemRef}>
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
          color={isHarvesting ? '#FF5F1F' : 'default'}
          size={isHarvesting ? 0.2 : 3.5}
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

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default RocketBooster;