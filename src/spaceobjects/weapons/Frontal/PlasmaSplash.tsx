import { useFrame } from "@react-three/fiber";
import SplashParticles from "../Effects/SplashParticles";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import Shader from "../../../postprocessing/Shader";

interface Props {
  position: THREE.Vector3;
  color: string;
  active: boolean;
}

export const PlasmaSplash = ({ position, color, active }: Props) => {
  const { vs: vertexSplash, fs: fragmentSplash } = Shader("plasma-splash");
  const splashMesh = useMemo(() => {
    const splashGeometry = new THREE.IcosahedronGeometry(2, 5);
    const splashMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(color) },
        color2: { value: new THREE.Color(0x3366ff) },
        time: { value: 0 },
        duration: { value: 0 },
      },
      vertexShader: vertexSplash,
      fragmentShader: fragmentSplash,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const splashMesh = new THREE.Mesh(splashGeometry, splashMaterial);
    return splashMesh;
  }, []);
  useFrame(() => {
    if (active) {
      splashMesh.material.uniforms.time.value += 5;
      splashMesh.material.uniforms.duration.value += 0.0085;
    }
  });
  useEffect(() => {
    splashMesh.material.uniforms.time.value = 0;
    splashMesh.material.uniforms.duration.value = 0;
  }, [active]);
  return active ? (
    <group>
      <primitive position={position} object={splashMesh} />
      <SplashParticles
        size={1.5}
        color="purple"
        position={position.clone()}
      />
    </group>
  ) : null;
};
