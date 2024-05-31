import { ElementRef, useEffect, useRef, useState } from "react";
import { useShallowStore } from "../../../store/UseStore";
import { Vector3, Group, Object3DEventMap } from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { ShipHull } from "./ShipHull";
import { EnemyShipSystem } from "./EnemyShipSystem";
import { EnemyShip as ES } from "../../../store/StoreState";
import { InfoBox } from "../../tools/InfoBox";
import { functions } from "../../../util";
import { Ignition } from "../../tools/Ignition";
import { Navigation } from "../navigation/Navigation";
import { SpaceShipId } from "../../../store/StoreAssets";

interface Props {
  eScene: Group<Object3DEventMap>;
  enemyShip: ES
  rotation?: Vector3
}

export const EnemyShip = ({ enemyShip, eScene, rotation}: Props) => {
  const { id: shipId, position: origin, nearby } = enemyShip
  const targetRef = useRef<any | null>(null)
  const position = enemyShip.meshRef?.position || origin
  const hullRef = useRef(enemyShip.hull)

  const type = rotation ? "hunting" : "patrol"
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
  const { scene } = useThree();
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const [showInfo, setShowInfo] = useState(false)

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
      {...enemyShip, meshRef: meshRef.current},
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

  const navProps = (type: "patrol" | "hunting") => {
return type === "patrol" ? {nearby, origin, shipType: "cruiser" as SpaceShipId, meshRef, shipId} : {nearby, origin, shipType: "cruiser" as SpaceShipId, meshRef, shipId, target: targetRef}
  }

  return (
    <group>
    <mesh {...functions} position={position} ref={meshRef} rotation={[rotation?.x || 0, rotation?.y ? rotation.y * 2 : 0, rotation?.z || 0]} onPointerDown={handleOnClick}>
      <ShipHull hullRef={hullRef} shipId={shipId} destroyShip={destroyShip} />
      <primitive object={eScene} />
     <Navigation
     type={type}
      props={navProps(type)}
      />
    </mesh>
 
      {showInfo && <InfoBox type="Cruiser" hullRef={hullRef} position={meshRef.current?.position || position} />}
    </group>
  );
};
