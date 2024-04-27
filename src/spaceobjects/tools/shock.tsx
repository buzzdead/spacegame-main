import * as THREE from "three";
import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, OrbitControls, Stats } from "@react-three/drei";
import vertexShader from '../shaders/shock-wavev'
import fragmentShader from '../shaders/shock-wave'

const GlowShaderMaterial = {
  uniforms: {
    viewVector: { type: "v3", value: new THREE.Vector3(0, 0, 0) }
  },
  vertexShader: `
  uniform vec3 viewVector;
  varying float intensity;
  void main() {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
      vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
      intensity = pow( dot(normalize(viewVector), actual_normal), 8.0 );
  }
  `,
  fragmentShader: `
    varying float intensity;
    void main() {
      vec3 glow = vec3(0, 1, 0) * intensity;
      gl_FragColor = vec4( glow, 1.0 );
    }
  `
};
export const Torus123 = () => {
    const torusRef = useRef<any>();
  
    useFrame((state, delta) => {
      if (!torusRef.current) return;
      const time = state.clock.getElapsedTime();
      const scale = Math.sin(time * 2) * 2 + 1;
      torusRef.current.scale.set(scale, scale, scale);
      torusRef.current.position.copy(new THREE.Vector3(Math.sin(time) * 2, 0, Math.cos(time) * 2));
    });
  
    return (
      <group ref={torusRef}>
        <mesh>
          <torusGeometry args={[10, 3, 32, 256]} />
          <MeshTransmissionMaterial
            transmission={1.0}
            thickness={5.0}
            attenuationColor={"green"}
            attenuationDistance={10.0}
          />
        </mesh>
      </group>
    );
  };