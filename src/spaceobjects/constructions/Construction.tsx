import { FC, ElementRef, useState } from 'react';
import { Suspense, useRef } from 'react';
import { Vector3 } from 'three'
import { SGS, useShallowStore } from '../../store/UseStore';
import SelectedIcon from '../tools/pyramidMesh';
import { useAsset } from '../../hooks/Asset';
import { useThree } from "@react-three/fiber";
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
  const { camera } = useThree()
  const ships = spaceShips;
  const fighter = ships.find((e) => e.id === "fighter");
  const constructionAsset = useAsset(fighter?.glbPath || "", 8)
  const menu = useRef(false)
  const { sound: explosionSound, calculateVolume: calculateExplosionSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/explo.mp3",
    scene: scene,
    minVolume: 0.75,
    camera: camera,
  });
  const handleClick = (e: any) => {
    e.stopPropagation()
    construction.type === "Refinary" ?
    origin?.position === position ? setOrigin(undefined) : setOrigin(construction)
    : 
    construction.type === "Enemy" ? setDestination(construction, "Attack", "Construction")
    :
    menu.current = !menu.current
  }

  const destroy = () => {
    setExplosions(position, "Big")
    removeConstruction(construction.id); scene.removeFromParent()
    explosionSound?.play()
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
