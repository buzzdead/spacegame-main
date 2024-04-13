import { FC, ElementRef, useEffect } from 'react';
import { Suspense, useRef } from 'react';
import { LoopRepeat } from 'three'
import { useAnimations, useGLTF } from '@react-three/drei';
import useStore, { SGS } from '../store/useStore';

interface Props {
  construction: SGS['Construction'];
}

const Construction: FC<Props> = ({ construction }) => {
  const { setOrigin } = useStore()
  const { glbPath, position, scale } = construction;
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const { scene, animations } = useGLTF(glbPath);
  const {actions, names} = useAnimations(animations)
  scale && scene.scale.set(scale, scale, scale)

  useEffect(() => {
    names.forEach(name => {
      const a = actions[name]
      if (a) {
        a.setEffectiveTimeScale(0.3)
        a.setLoop(LoopRepeat, Infinity).play()
      }
    })
  }, [actions, names])

  return (
    <Suspense fallback={null}>
      <mesh onClick={() => setOrigin(position)} ref={meshRef} position={position}>
        <primitive object={scene} />
      </mesh>
    </Suspense>
  );
};

export default Construction;
