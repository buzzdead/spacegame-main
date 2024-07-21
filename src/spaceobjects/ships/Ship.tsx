import { FC, ElementRef, Suspense, useRef, useEffect, useState } from "react";
import { Group, Object3DEventMap } from "three";
import { SGS, useShallowStore } from "../../store/UseStore";
import { SelectedShip } from "../tools/SelectedShip";
import {Navigation} from "./navigation/Navigation";
import { useKeyboard } from "../../hooks/Keys";
import { InfoBox } from "../tools/InfoBox";
import { functions } from "../../util";
import { FriendShipHull } from "./FrindHull";
import { useThree } from "@react-three/fiber";

interface Props {
  ship: SGS["Ship"];
  scene: Group<Object3DEventMap>;
}

const Ship: FC<Props> = ({ ship, scene }) => {
  const { setSelected, removeShip, setExplosions } = useShallowStore([
    "setSelected",
    "removeShip",
    "setExplosions",
  ]);
  const { position } = ship;
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const [destroyed, setDestroyed] = useState(false);
  const isSelected = useRef(false)
  const [showInfo, setShowInfo] = useState(false)
  const keyMap = useKeyboard();
  const { scene: mainScene } = useThree()

  const isFighter = ship.assetId === "fighter";
  const isHawk = ship.assetId === "hawk";

  const handleOnClick = (e: any) => {
    e.stopPropagation();
    if(e.ctrlKey) setShowInfo(!showInfo)
    else setSelected(ship.id, isSelected.current);
  };

  useEffect(() => {
    if (destroyed){
        setExplosions(meshRef.current?.position || position, "Medium")
        setTimeout(() => {
          removeShip(ship.id, true);
          const projectiles = mainScene.children.filter(c => c.name === meshRef?.current?.name + ' - projectile')
          projectiles.forEach(p => {p.removeFromParent(); mainScene.remove(p)})
          scene.removeFromParent();
        }, 150)
      }
  }, [destroyed]);

  const handleOver = (e: any) => {
    e.stopPropagation()
    if (keyMap && keyMap['KeyS']) {
      setSelected(ship.id)
    }
    if(keyMap && keyMap['KeyD'])
      setSelected(ship.id, true)
    
  }

  const props = { shipId: ship.id, isSelected, meshRef: meshRef, shipType: ship.assetId}
  
  return (
    <Suspense fallback={null}>
      <mesh {...functions} onPointerDown={handleOnClick} onPointerOver={handleOver} ref={meshRef} position={position}>
        <FriendShipHull
          friend
          destroyShip={() => {
            setDestroyed(true);
          }}
          shipId={ship.id}
        />
        <SelectedShip
          shipId={ship.id}
          shipType={ship.assetId}
          onSelected={(b) => isSelected.current = b}
        />
        <Navigation
         type="user"
         props={props}
        />
        <primitive object={scene} />
       
      </mesh>
      {showInfo && <InfoBox type={isFighter ? "Fighter" : "Cargo"} meshRef={meshRef} position={meshRef.current?.position || ship.position}/>}
    </Suspense>
  );
};

export default Ship;