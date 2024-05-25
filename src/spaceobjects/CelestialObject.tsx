import { FC, ElementRef, useEffect } from 'react';
import { Suspense, useRef } from 'react';
import useStore, { SGS } from '../store/UseStore';
import { useAsset } from '../hooks/Asset';
import { DestinationType, ObjectType } from '../store/StoreState';

interface CelestialObjectProps {
  celestialObject: SGS['CO'];
}

const setDestinationAndObjectType = (assetId: string): {type: DestinationType, objectType: ObjectType} => {
  const type = assetId.includes("planet") 
  ? "Travel" 
  : assetId.includes("sphere") 
  ? "Collect" 
  : "Harvest"
  const objectType = assetId.includes("sphere") ? "MissionItem" : "Planet"
  return {type, objectType}
}

const CelestialObject: FC<CelestialObjectProps> = ({ celestialObject }) => { 
  const { glbPath, position, scale } = celestialObject;
  const setDestination = useStore((state) => state.setDestination)
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const scene = useAsset(glbPath, scale || 1)

const handleSetDestination = () => {
  const {type, objectType} = setDestinationAndObjectType(celestialObject.assetId)
  setDestination(celestialObject, type, objectType)
}

useEffect(() => {
  if(celestialObject.assetId === "sphere") handleSetDestination()
}, [])

  return (
    <Suspense fallback={null}>
      <mesh onClick={handleSetDestination} ref={meshRef} position={position}>
        {celestialObject.assetId.includes("planet") && <directionalLight position={[185, 185, 25]} intensity={2.5}/>}
        <primitive object={scene} />
      </mesh>
    </Suspense>
  );
};

export default CelestialObject;
