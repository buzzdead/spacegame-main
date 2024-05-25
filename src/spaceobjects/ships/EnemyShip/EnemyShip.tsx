import { ElementRef, useEffect, useRef, useState } from "react";
import { useShallowStore } from "../../../store/UseStore";
import { Vector3, Group, Object3DEventMap } from "three";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { ShipHull } from "./ShipHull";
import { EnemyShipSystem } from "./EnemyShipSystem";
import { EnemyNavigation } from "./Navigation";
import { EnemyShip as ES } from "../../../store/StoreState";
import { InfoBox } from "../../tools/InfoBox";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";

interface Props {
  eScene: Group<Object3DEventMap>;
  enemyShip: ES
}

export const EnemyShip = ({ enemyShip, eScene}: Props) => {
  const { id: shipId, position: origin, nearby } = enemyShip
  const position = enemyShip.meshRef?.position || origin
  const hullRef = useRef(enemyShip.hull)
  const {
    setDestination,
    setSelectedEnemies,
    removeShip,
    setExplosions,
    setEnemyShipRef,
  } = useShallowStore([
    "setDestination",
    "setSelectedEnemies",
    "removeShip",
    "setExplosions",
    "setEnemyShipRef",
  ]);
  const { camera, scene } = useThree();
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const [fire, setFire] = useState(false);
  const [showInfo, setShowInfo] = useState(false)
  const texture = useTexture.preload("/assets/fire1.png");

  useEffect(() => {
    setEnemyShipRef(meshRef.current, shipId);
  }, []);

  const destroyShip = () => {
    setExplosions(meshRef.current?.position || position, "Big");
    setTimeout(() => {
      removeShip(shipId);
      scene.removeFromParent();
      setSelectedEnemies({id: shipId, hull: 0, position: position, nearby: false}, true)
    }, 150)
    //setTimeout(() => {setDestroyed(false); setSelectedEnemies({ship: shipId, hull: 100})}, 10000)
  };
  const handleOnClick = (e: any) => {
    e.stopPropagation();
    if (e.ctrlKey) {setShowInfo(!showInfo); return;}
    setDestination(
      enemyShip,
      "Attack",
      "Ship"
    );
    setSelectedEnemies({
      id: shipId,
      hull: 350,
      position: meshRef?.current?.position || new Vector3(0, 0, 0),
      nearby: false,
    });
  };
  return (
    <group>
    <mesh position={position} ref={meshRef} onPointerDown={handleOnClick}>
      <ShipHull hullRef={hullRef} shipId={shipId} destroyShip={destroyShip} />
      <primitive object={eScene} />
      <EnemyNavigation
        nearby={nearby}
        origin={origin}
        shipType="cruiser"
        meshRef={meshRef}
        shipId={shipId}
      />
    </mesh>
    <EnemyShipSystem
        shipRef={meshRef}
        currentPos={meshRef.current?.position || position}
        nearby={nearby}
        origin={position}
      />
      {showInfo && <InfoBox type="Cruiser" hullRef={hullRef} position={meshRef.current?.position || position} />}
    </group>
  );
};
