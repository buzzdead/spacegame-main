import { FC, ElementRef, Suspense, useRef, useEffect, useState } from "react";
import { Group, Object3DEventMap } from "three";
import { SGS, useShallowStore } from "../../store/UseStore";
import { ShipHull } from "./EnemyShip/ShipHull";
import { SelectedShip } from "../tools/SelectedShip";
import Navigation from "./UseNavigation";
import { useKeyboard } from "../../hooks/Keys";
import { InfoBox } from "../tools/InfoBox";

interface Props {
  ship: SGS["Ship"];
  scene: Group<Object3DEventMap>;
}

const Ship: FC<Props> = ({ ship, scene }) => {
  const { setSelected, removeShip, setExplosions } = useShallowStore([
    "setSelected",
    "removeShip",
    "setExplosions"
  ]);

  const { position } = ship;
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const [destroyed, setDestroyed] = useState(false);
  const isSelected = useRef(false)
  const [showInfo, setShowInfo] = useState(false)
  const keyMap = useKeyboard();
  const hullRef = useRef(ship.hull)


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
          scene.removeFromParent();
        }, 150)
      }
  }, [destroyed]);

  const handleOver = () => {
    if (keyMap && keyMap['KeyS']) {
      setSelected(ship.id)
    }
    if(keyMap && keyMap['KeyD'])
      setSelected(ship.id, true)
    
  }
 
  return (
    <Suspense fallback={null}>
      <mesh onPointerEnter={handleOver} onPointerDown={handleOnClick} ref={meshRef} position={position}>
        <ShipHull
          friend
          destroyShip={() => {
            setDestroyed(true);
          }}
          shipId={ship.id}
          hullRef={hullRef}
        />
        <SelectedShip
          shipId={ship.id}
          isFighter={isFighter}
          onSelected={(b) => isSelected.current = b}
        />
        <Navigation
          shipId={ship.id}
          isSelected={isSelected}
          meshRef={ship.meshRef || meshRef}
          shipType={ship.assetId}
        />
        <primitive object={scene} />
       
      </mesh>
      {showInfo && <InfoBox type={isFighter ? "Fighter" : "Cargo"} hullRef={hullRef} position={meshRef.current?.position || ship.position}/>}
    </Suspense>
  );
};

export default Ship;