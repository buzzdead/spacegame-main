import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import React from "react";
import { useTexture } from "@react-three/drei";

const _VS = /*glsl*/ `
uniform float uTime;
uniform float uRadius;

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}


void main() {
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);
  float size = distanceFactor * 1.5 + 3.0;
  vec3 particlePosition = position * rotation3dY(uTime * 0.3 * distanceFactor);

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = size;
  // Size attenuation;
  gl_PointSize *= (1.0 / - viewPosition.z);
}
`;

const _FS = /*glsl*/ `

void main() {
    gl_FragColor = vec4(0.34, 0.53, 0.96, 1.0);
  }`;

interface Props {
  position: THREE.Vector3;
}
export const ParticleSystem = ({ position }: Props) => {
  const pos = position.clone();
  const particleSystemRef = useRef<any>();
  pos.y += 15;
  const { scene } = useThree();
  const texture = useTexture("/assets/particle.png");
  const [particles, setParticles] = useState<Float32Array>();
    console.log( window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0)))
  useEffect(() => {
    const addParticles = () => {
      const newParticles = new Float32Array(100 * 3); // 3 components per vertex (x, y, z)
      for (let i = 0; i < 100; i++) {
        newParticles[i * 3] = (Math.random() * 2 - 1) * 1.0; // x
        newParticles[i * 3 + 1] = (Math.random() * 2 - 1) * 1.0; // y
        newParticles[i * 3 + 2] = (Math.random() * 2 - 1) * 1.0; // z
      }
      setParticles(newParticles);
    };

    addParticles();
  }, []);
  useFrame(() => {
    const updateParticles = () => {
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position
          .array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += 0.03;

          if (positions[i + 1] > 100 / 25) {
            positions[i] = (Math.random() - 0.5) * 0.3;
            positions[i + 1] = 0;
            positions[i + 2] = (Math.random() - 0.5) * 0.2;
          }
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate =
          true;
      }
    };
    updateParticles();
  });
  if (!particles || particles.length === 0) return null;
  return (
    <mesh position={pos}>
      <points ref={particleSystemRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position" // corrected attribute attachment
            count={particles.length / 3} // divided by 3 because each particle has 3 components
            array={particles}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-uvw" // corrected attribute attachment
            count={particles.length / 3} // divided by 3 because each particle has 3 components
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
   
          <shaderMaterial
            vertexShader={_VS}
            fragmentShader={_FS}
            blending={THREE.AdditiveBlending}
            depthTest
            depthWrite={true}
            colorWrite
            transparent
            vertexColors
            
            uniforms={{
                uTime: {
                    value: 555.0
                  },
                  uRadius: {
                    value: 22
                  }
            }}
            attach="material"
          />
      </points>
    </mesh>
  );
};
