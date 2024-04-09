import { FC, ElementRef } from 'react';
import { Suspense, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Color, ShaderMaterial, AdditiveBlending } from 'three'
import { SGS } from '../store/useStore';
import fragmentShader from './shaders/glowFragmentShader'
import vertexShader from './shaders/glowVertexShader'

interface CelestialObjectProps {
  celestialObject: SGS['CO'];
}

const CelestialObject: FC<CelestialObjectProps> = ({ celestialObject }) => { 
  const { glbPath, position, scale } = celestialObject;
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const { scene } = useGLTF(glbPath);
  scale && scene.scale.set(scale, scale, scale)

  const glowMaterial = new ShaderMaterial({
    uniforms: {
        glowColor: { value: new Color(0x88ffff) }, // Set your desired glow color
        glowStrength: { value: 0.9 } // Adjust glow intensity
    },
    vertexShader,
    fragmentShader,
    transparent: true, // Enable transparency for blending
    blending: AdditiveBlending // Use additive blending for the glow effect
});

/* scene.traverse((child) => { 

  if ((child as Mesh).isMesh) { 
      const mesh = child as Mesh; // Assert the type as THREE.Mesh
      mesh.material = glowMaterial;  
  }
});
 */
  return (
    <Suspense fallback={null}>
      <mesh onClick={() => console.log(scene)} ref={meshRef} position={position}>
        <primitive object={scene} />
      </mesh>
    </Suspense>
  );
};

export default CelestialObject;
