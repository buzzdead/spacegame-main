import { FC, ElementRef } from 'react';
import { Suspense, useRef } from 'react';
import { Color, ShaderMaterial, AdditiveBlending } from 'three'
import useStore, { SGS } from '../store/useStore';
import { useAsset } from '../hooks/useAsset';

interface CelestialObjectProps {
  celestialObject: SGS['CO'];
}

const CelestialObject: FC<CelestialObjectProps> = ({ celestialObject }) => { 
  const { glbPath, position, scale } = celestialObject;
  const setDestination = useStore((state) => state.setDestination)
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const scene = useAsset(glbPath, scale || 1)

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
