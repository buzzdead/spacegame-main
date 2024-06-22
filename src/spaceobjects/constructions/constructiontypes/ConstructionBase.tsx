import { ElementRef, useRef } from "react";
import { Vector3 } from "three";
import { useAsset } from "../../../hooks/Asset";
import { functions } from "../../../util";
import { useShallowStore } from "../../../store/UseStore";
import UseSoundEffect from "../../../hooks/SoundEffect";
import { ConstructionHull } from "../ConstructionHull";

interface Props {
  construction: any;
  children?: any;
  onClick: (e: any) => void;
}

export const ConstructionBase = ({
  construction,
  children,
  onClick,
}: Props) => {

  const { setExplosions, removeConstruction } = useShallowStore([
    "setExplosions",
    "removeConstruction",
  ]);
 
  const { glbPath, position, scale } = construction
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const scene = useAsset(glbPath || "", scale || 1);

  const bool =
    construction.type === "Refinary" ||
    construction.type === "Enemy" ||
    construction.type === "Construction";

  const { sound: explosionSound, calculateVolume: calculateExplosionSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/explo.mp3",
      minVolume: 0.75,
    });

  const destroy = () => {
    setExplosions(position, "Big");
    setTimeout(() => {
      removeConstruction(construction.id);
      scene.removeFromParent();
      explosionSound?.play();
    }, 150);
  };
  const hoverFunctions = bool ? functions : {};
  return (
    <group>
      <mesh
        position={position}
        {...hoverFunctions}
        onClick={onClick}
        ref={meshRef}
      >
         <primitive object={scene} />
         {children}
      </mesh>
      <ConstructionHull destroyShip={destroy} id={construction.id} />
    </group>
  );
};
