import { ElementRef, useEffect, useRef, useState } from "react";
import { useShallowStore } from "../../../store/UseStore";
import { Vector3, Group, Object3DEventMap } from "three";
import { ShipHull } from "./ShipHull";
import { EnemyShipSystem } from "./EnemyShipSystem";
import { EnemyShip as ES } from "../../../store/StoreState";
import { InfoBox } from "../../tools/InfoBox";
import { functions } from "../../../util";
import { Navigation } from "../navigation/Navigation";
import { SpaceShipId } from "../../../store/StoreAssets";
import { NavigationNames } from "../navigation/types";
import { NavigationSwitcher } from "./NavigationSwitcher";

interface Props {
  eScene: Group<Object3DEventMap>;
  enemyShip: ES
  rotation?: Vector3
}

export const EnemyShip = ({ enemyShip, eScene, rotation}: Props) => {
  const { id: shipId, position: origin } = enemyShip
  const targetRef = useRef<any | null>(null)
  const position = enemyShip.meshRef?.position || origin
  const hullRef = useRef(enemyShip.hull)
  const nearby = useRef(false)

  const [type, setType] = useState<NavigationNames>(rotation ? "hunting" : "patrol")
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
  
  const meshRef = useRef<ElementRef<"mesh">>(null);
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    setEnemyShipRef({...meshRef.current, hull: 350}, shipId);
  }, []);

  const destroyShip = () => {
    setExplosions(meshRef.current?.position || position, "Big");
    setTimeout(() => {
      removeShip(shipId);
      eScene.removeFromParent();
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
      nearby: nearby.current,
    });
  };

  const props = {nearby, origin, shipType: "cruiser" as SpaceShipId, meshRef, shipId, target: targetRef}

  return (
    <group>
    <mesh position={position} ref={meshRef} rotation={[0, rotation ? 3.1 : 0, 0]} onPointerDown={handleOnClick}>
      <ShipHull hullRef={hullRef} shipId={shipId} destroyShip={destroyShip} />
      <primitive object={eScene} />
     <Navigation
     type={type}
      props={props}
      />
    </mesh>
    <NavigationSwitcher toggleType={() => setType("hunting")}/>
    <EnemyShipSystem
        distance={type === "hunting" ? 300 : 75}
        shipRef={meshRef}
        nearby={nearby}
        targetRef={targetRef}
      />
      {showInfo && <InfoBox type="Cruiser" meshRef={hullRef} position={meshRef.current?.position || position} />}
    </group>
  );
};
