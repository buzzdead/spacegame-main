import { FC, ElementRef, Suspense, useRef, useEffect, useState } from "react";
import { Vector3, Group, Object3DEventMap } from "three";
import { SGS, useShallowStore } from "../../store/UseStore";
import { useFrame } from "@react-three/fiber";
import SelectedIcon from "../tools/pyramidMesh";
import { Ignition } from "../tools/Ignition";
import { HarvestLaser } from "../tools/HarvestLaser";
import { LaserCannon } from "../weapons/LaserCannon";
import UseNavigation from "./UseNavigation";
import ShipSound from "./ShipSound";
import { ShipHull } from "./EnemyShip/ShipHull";
import Explosion from "../tools/Explosion";
import { SWave } from "./EnemyShip/swave";
import { EffectComposer } from "@react-three/postprocessing";
import { ParticleSystem } from "../tools/particlesystem";
import { SelectedShip } from "../tools/SelectedShip";
import Navigation from "./UseNavigation";

interface Props {
  ship: SGS["Ship"];
  scene: Group<Object3DEventMap>
}

const Ship: FC<Props> = ({ ship, scene }) => {
  const { setSelected, setShipRef, removeShip } = useShallowStore([
    "setSelected",
    "setShipRef",
    "removeShip"
  ]);

  const { position } = ship;
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const [destroyed, setDestroyed] = useState(false)
  const [isSelected, setIsSelected] = useState(false)

  const isFighter = ship.assetId === "fighter";
  const isHawk = ship.assetId === "hawk"
  console.log("rendering ship", ship.id)



  const handleOnClick = (e: any) => {
    e.stopPropagation();
    setSelected(ship.id);
  };

  useEffect(() => {
    setShipRef(meshRef.current, ship.id)
  }, [meshRef])
  useEffect(() => {
    if(destroyed)
      
      setTimeout(() => {removeShip(ship.id, true); scene.removeFromParent()}, 5000)
  }, [destroyed])
  if(destroyed) return <Explosion position={meshRef.current?.position || new Vector3(0,0,0)}/>
  return (
    <Suspense fallback={null}>
      <mesh onClick={handleOnClick} ref={meshRef} position={position}>
        <ShipHull friend destroyShip={() =>{setDestroyed(true);}} shipId={ship.id}/>
        <SelectedShip shipId={ship.id} isFighter={isFighter} onSelected={(b) => setIsSelected(b)}/>
        <Navigation shipId={ship.id} isSelected={isSelected} meshRef={meshRef} shipType={ship.assetId}/>
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
