import { FC, ElementRef } from 'react';
import { Suspense, useRef } from 'react';
import { Vector3 } from 'three'
import { SGS, useShallowStore } from '../../store/UseStore';
import SelectedIcon from '../tools/pyramidMesh';
import { useAsset } from '../../hooks/Asset';
import { ConstructionMenu } from './ConstructionMenu';
import { spaceShips } from '../../store/StoreAssets';

interface Props {
  construction: SGS['Construction'];
}

const Construction: FC<Props> = ({ construction }) => {
  const { setOrigin, origin } = useShallowStore(["origin", "setOrigin"])
  const { glbPath, position, scale } = construction;
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const scene = useAsset(glbPath, scale || 1)
  const ships = spaceShips;
  const fighter = ships.find((e) => e.id === "fighter");
  const constructionAsset = useAsset(fighter?.glbPath || "", 8)
  const menu = useRef(false)
  const handleClick = (e: any) => {
    e.stopPropagation()
    construction.type === "Refinary" ?
    origin === position ? setOrigin(undefined) : setOrigin(position)
    : 
    menu.current = !menu.current
  }

  return (
    <Suspense fallback={null}>  
      <mesh ref={meshRef} position={position}>
      {origin === position && <SelectedIcon color={'yellow'} position={new Vector3(0,4,0)} /> }
      <ConstructionMenu menu={menu} />
        <primitive onClick={handleClick} object={scene} />
      </mesh>
    </Suspense>
  );
};

export default Construction;
