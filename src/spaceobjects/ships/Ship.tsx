import { FC, ElementRef, Suspense, useRef, useEffect, useState } from "react";
import { Group, Object3DEventMap } from "three";
import { SGS, useShallowStore } from "../../store/UseStore";
import { ShipHull } from "./EnemyShip/ShipHull";
import { SelectedShip } from "../tools/SelectedShip";
import Navigation from "./UseNavigation";
import { useKeyboard } from "../../hooks/Keys";

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
  const [isSelected, setIsSelected] = useState(false);
  const keyMap = useKeyboard();


  const isFighter = ship.assetId === "fighter";
  const isHawk = ship.assetId === "hawk";

  const handleOnClick = (e: any) => {
    e.stopPropagation();
    setSelected(ship.id);
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
      <mesh onPointerEnter={handleOver} onClick={handleOnClick} ref={meshRef} position={position}>
        <ShipHull
          friend
          destroyShip={() => {
            setDestroyed(true);
          }}
          shipId={ship.id}
        />
        <SelectedShip
          shipId={ship.id}
          isFighter={isFighter}
          onSelected={(b) => setIsSelected(b)}
        />
        <Navigation
          shipId={ship.id}
          isSelected={isSelected}
          meshRef={ship.meshRef || meshRef}
          shipType={ship.assetId}
        />
        <primitive object={scene} />
      </mesh>
    </Suspense>
  );
};

export default Ship;

/*   const glowMaterial = new ShaderMaterial({
    uniforms: {
      glowColor: { value: new Color(0x00ff80) }, // Neon green color
      glowStrength: { value: 1.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true, // Important for blend effects like glows
  }); */
