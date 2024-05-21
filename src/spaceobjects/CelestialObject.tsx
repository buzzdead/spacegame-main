import { FC, ElementRef, useEffect } from 'react';
import { Suspense, useRef } from 'react';
import { Color, ShaderMaterial, AdditiveBlending } from 'three'
import useStore, { SGS } from '../store/UseStore';
import { useAsset } from '../hooks/Asset';
import { DestinationType } from '../store/StoreState';

interface CelestialObjectProps {
  celestialObject: SGS['CO'];
}

const CelestialObject: FC<CelestialObjectProps> = ({ celestialObject }) => { 
  const { glbPath, position, scale } = celestialObject;
  const setDestination = useStore((state) => state.setDestination)
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const scene = useAsset(glbPath, scale || 1)

const handleSetDestination = () => {
  const type: DestinationType = celestialObject.assetId.includes("planet") ? "Travel" : celestialObject.assetId.includes("sphere") ? "Collect" : "Harvest"
  setDestination(celestialObject, type, celestialObject.assetId.includes("sphere") ? "MissionItem" : "Planet")
}

useEffect(() => {
  if(celestialObject.assetId === "sphere") handleSetDestination()
}, [])

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
