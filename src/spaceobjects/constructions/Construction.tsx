import { FC, ElementRef, useState } from 'react';
import { Suspense, useRef } from 'react';
import { Vector3 } from 'three'
import { Center } from '@react-three/drei';
import { SGS, useShallowStore } from '../../store/useStore';
import SelectedIcon from '../tools/pyramidMesh';
import ConstructionAsset from './ConstructionAsset';
import { useAsset } from '../useAsset';

interface Props {
  construction: SGS['Construction'];
}

const Construction: FC<Props> = ({ construction }) => {
  const { setOrigin, origin } = useShallowStore(["origin", "setOrigin"])
  const { glbPath, position, scale } = construction;
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const scene = useAsset(glbPath, scale || 1)
  const [menu, setMenu] = useState(false)
  const handleClick = () => {
    construction.type === "Refinary" ?
    origin === position ? setOrigin(undefined) : setOrigin(position)
    : 
    setMenu(!menu)
  }

  return (
    <Suspense fallback={null}>
      <mesh ref={meshRef} position={position}>
      {origin === position && <SelectedIcon color={'yellow'} position={new Vector3(0,4,0)} /> }
        <Center disableY><ConstructionAsset shouldRender={menu} /></Center>
        <primitive onClick={handleClick} object={scene} />
      </mesh>
    </Suspense>
  );
};

export default Construction;