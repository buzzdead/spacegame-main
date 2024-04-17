import { FC, ElementRef, useEffect, useState } from 'react';
import { Suspense, useRef } from 'react';
import { LoopRepeat, Vector3 } from 'three'
import { useAnimations, useGLTF } from '@react-three/drei';
import useStore, { SGS } from '../store/useStore';
import SelectedIcon from './tools/pyramidMesh';
import ConstructionAsset from './ConstructionAsset';

interface Props {
  construction: SGS['Construction'];
}

const Construction: FC<Props> = ({ construction }) => {
  const { setOrigin, origin } = useStore()
  const { glbPath, position, scale } = construction;
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const { scene, animations } = useGLTF(glbPath);
  const {actions, names} = useAnimations(animations)
  const [menu, setMenu] = useState(false)
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

  const handleClick = () => {
    construction.type === "Refinary" ?
    origin === position ? setOrigin(undefined) : setOrigin(position)
    : 
    setMenu(!menu)
  }

  return (
    <Suspense fallback={null}>
      <mesh ref={meshRef} position={position}>
      {origin === position && <SelectedIcon color={'yellow'} position={new Vector3(3, 18, -6)} /> }
        <ConstructionAsset shouldRender={menu} />
        <primitive onClick={handleClick} object={scene} />
      </mesh>
    </Suspense>
  );
};

export default Construction;
