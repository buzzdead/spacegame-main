import { FC, ElementRef } from 'react';
import { Suspense, useRef } from 'react';
import { Vector3 } from 'three'
import { SGS, useShallowStore } from '../../store/UseStore';
import SelectedIcon from '../tools/pyramidMesh';
import { useAsset } from '../../hooks/Asset';
import { ConstructionMenu } from './ConstructionMenu';
import { spaceShips } from '../../store/StoreAssets';
import { ConstructionHull } from './ConstructionHull';
import UseSoundEffect from '../../hooks/SoundEffect';

interface Props {
  construction: SGS['Construction'];
}

const Construction: FC<Props> = ({ construction }) => {
  const { setOrigin, origin, setDestination, setExplosions, removeConstruction } = useShallowStore(["origin", "setOrigin", "setDestination", "setExplosions", "removeConstruction"])
  const { glbPath, position, scale } = construction;
  const meshRef = useRef<ElementRef<'mesh'>>(null);
  const scene = useAsset(glbPath, scale || 1)
  const ships = spaceShips;
  const fighter = ships.find((e) => e.id === "fighter");
  const constructionAsset = useAsset(fighter?.glbPath || "", 8)
  const menu = useRef(construction.type === "Construction" ? true : false)
  const { sound: explosionSound, calculateVolume: calculateExplosionSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/explo.mp3",
    minVolume: 0.75,
  });
  const handleClick = (e: any) => {
    e.stopPropagation()
    destroy()
    return;
    construction.type === "Refinary" ?
    origin?.position === position ? setOrigin(undefined) : setOrigin(construction)
    : 
    construction.type === "Enemy" ? setDestination(construction, "Attack", "Construction")
    :
    menu.current = !menu.current
  }

  const destroy = () => {
    setExplosions(position, "Big")
    setTimeout(() => {
      removeConstruction(construction.id); scene.removeFromParent()
      explosionSound?.play()
    }, 150)
   
  }

  return (
    <Suspense fallback={null}>  
      <mesh ref={meshRef} position={position}>
      {origin?.position === position && <SelectedIcon color={'yellow'} position={new Vector3(0,4,0)} /> }
      <ConstructionMenu menu={menu} />
        <primitive onClick={handleClick} object={scene} />
        <ConstructionHull destroyShip={destroy} id={construction.id}/>
      </mesh>
    </Suspense>
  );
};

export default Construction;
