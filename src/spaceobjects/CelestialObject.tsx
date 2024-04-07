import { FC, ElementRef } from 'react';
import { Suspense, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { SGS } from '../store/useStore';

interface CelestialObjectProps {
  celestialObject: SGS['CO'];
}

const CelestialObject: FC<CelestialObjectProps> = ({ celestialObject }) => {
  const { glbPath, position, scale } = celestialObject;
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const { scene } = useGLTF(glbPath);
  scale && scene.scale.set(scale, scale, scale)

  return (
    <Suspense fallback={null}>
      <mesh onClick={() => console.log(scene)} ref={meshRef} position={position}>
        <primitive object={scene} />
      </mesh>
    </Suspense>
  );
};

export default CelestialObject;
