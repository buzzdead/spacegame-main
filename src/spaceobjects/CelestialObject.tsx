import { FC, ElementRef } from 'react';
import { Suspense, useRef } from 'react';
import { Color, ShaderMaterial, AdditiveBlending } from 'three'
import useStore, { SGS } from '../store/useStore';
import fragmentShader from './shaders/glowFragmentShader'
import vertexShader from './shaders/glowVertexShader'
import { useAsset } from './useAsset';

interface CelestialObjectProps {
  celestialObject: SGS['CO'];
}

const CelestialObject: FC<CelestialObjectProps> = ({ celestialObject }) => { 
  const { glbPath, position, scale } = celestialObject;
  const setDestination = useStore((state) => state.setDestination)
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const scene = useAsset(glbPath, scale || 1)

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
const handleSetDestination = () => {
  if(celestialObject.assetId.includes("planet")) return
  setDestination(position)
}
  return (
    <Suspense fallback={null}>
      <mesh onClick={handleSetDestination} ref={meshRef} position={position}>
        {celestialObject.assetId.includes("planet") && <directionalLight position={[185, 185, 0]} intensity={5.5}/>}
        <primitive object={scene} />
      </mesh>
    </Suspense>
  );
};

export default CelestialObject;
