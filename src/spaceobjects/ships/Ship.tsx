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

interface Props {
  ship: SGS["Ship"];
  scene: Group<Object3DEventMap>
}

const Ship: FC<Props> = ({ ship, scene }) => {
  const { setSelected, selected, setShipRef } = useShallowStore([
    "setSelected",
    "selected",
    "setShipRef",
  ]);

  const { position } = ship;
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const [destroyed, setDestroyed] = useState(false)
  const {
    isHarvesting,
    isReturning,
    isFighting,
    isTraveling,
    calculateDirectionAndRotation,
    shipsDestination,
    shipsOrigin,
    updateShipPosition,
    setIsFighting
  } = UseNavigation({ shipId: ship.id, meshRef, shipType: ship.assetId });

  const selectD = selected.find((s) => s.id === ship.id);
  const isFighter = ship.assetId === "fighter";
  const isHawk = ship.assetId === "hawk"

  useFrame(() => {
    if (
      meshRef.current &&
      shipsDestination &&
      shipsOrigin &&
      (isTraveling || isReturning)
    ) {
      if(!meshRef.current.name) {meshRef.current.name = ship.id}
      const targetPosition = isTraveling ? shipsDestination : shipsOrigin;
      const { direction, targetQuaternion } =
        calculateDirectionAndRotation(targetPosition);

      direction &&
        updateShipPosition(direction, targetQuaternion, targetPosition);
    }
  });

  const handleOnClick = (e: any) => {
    e.stopPropagation();
    setSelected(ship.id);
  };

  useEffect(() => {
    setShipRef(meshRef.current, ship.id)
  }, [meshRef])
  if(destroyed) return <Explosion position={meshRef.current?.position || new Vector3(0,0,0)}/>
  return (
    <Suspense fallback={null}>
      <mesh onClick={handleOnClick} ref={meshRef} position={position}>
        <ShipHull friend destroyShip={() =>{setDestroyed(true);}} shipId={ship.id}/>
        <ShipSound
          isHarvesting={isHarvesting}
          isReturning={isReturning}
          isTraveling={isTraveling}
          meshRef={meshRef}
        />
        {selectD && (
          <SelectedIcon
            color={0x00ff80}
            position={
              isFighter ? new Vector3(-8, 2.5, -1.5) : new Vector3(0, 2.5, 2)
            }
          />
        )}
        <primitive object={scene} />
        {(isFighter || ship.assetId === "hawk") && (
          <LaserCannon
            position={meshRef.current ? meshRef.current.position : new Vector3(0,0,0)}
            setFightDone={() => setIsFighting(false)}
            target={shipsDestination || new Vector3(0,0,0)}
            color={isHawk ? 'green' : 'red'}
            fire={isFighting}
          />
        )}
        {(isTraveling || isReturning) && <Ignition type={ship.assetId} />}
        {isHarvesting && ship.assetId !== "fighter" && (
          <HarvestLaser isHarvesting={isHarvesting} />
        )}
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
