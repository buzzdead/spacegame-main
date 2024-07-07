import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SplashParticlesProps {
  position: THREE.Vector3;
  color: string;
  count?: number;
  size?: number;
  duration?: number;
}

const SplashParticles: React.FC<SplashParticlesProps> = ({
  position,
  color,
  count = 100,
  size = 0.5,
  duration = 1000,
}) => {
  const points = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;
      sizes[i] = Math.random() * size;
    }

    return [positions, sizes];
  }, [count, size]);

  const uniforms = useMemo(() => ({
    color: { value: new THREE.Color(color) },
    time: { value: 0 },
  }), [color]);

  useEffect(() => {
    if (points.current) {
      points.current.position.copy(position);
    }
  }, [position]);

  useFrame((state) => {
    if (points.current) {
      uniforms.time.value = state.clock.getElapsedTime();

      const positions = points.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.35;
        positions[i + 1] += (Math.random() - 0.5) * 0.35;
        positions[i + 2] += (Math.random() - 0.5) * 0.35;
      }
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          uniform float time;
          attribute float size;
          void main() {
            vec3 pos = position;
            pos += normalize(position) * sin(time * 5.0 + length(position) * 10.0) * 0.1;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform vec3 color;
          void main() {
            if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
            gl_FragColor = vec4(color, 1.0 - length(gl_PointCoord - vec2(0.5, 0.5)) * 2.0);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default SplashParticles;