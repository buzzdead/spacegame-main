import { ElementRef, useEffect, useRef, useState } from "react";
import { useShallowStore } from "../../../store/UseStore";
import { Vector3, Color, Group, Object3DEventMap } from "three";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import UseSoundEffect from "../../../hooks/SoundEffect";
import { ShipHull } from "./ShipHull";
import { EnemyShipSystem } from "./EnemyShipSystem";
import { EnemyNavigation } from "./Navigation";
import { EnemyShip as ES } from "../../../store/StoreState";
import { Ignition } from "../../tools/Ignition";

interface Props {
  eScene: Group<Object3DEventMap>;
  enemyShip: ES
}

export const EnemyShip = ({ enemyShip, eScene}: Props) => {
  const { id: shipId, position: origin, nearby } = enemyShip
  const position = enemyShip.meshRef?.position || origin
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
  const texture = useTexture.preload("/assets/fire1.png");
  const [destroyed, setDestroyed] = useState(false);
  const { sound: explosionSound, calculateVolume: calculateExplosionSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/explo.mp3",
      scene: scene,
      minVolume: 0.75,
      camera: camera,
    });
  useEffect(() => {
    const distance = camera.position.distanceTo(eScene.position);
    calculateExplosionSound(distance);
  }, [camera]);

  useEffect(() => {
    setEnemyShipRef(meshRef.current, shipId);
  }, []);

  const destroyShip = () => {
    setDestroyed(true);
    setExplosions(meshRef.current?.position || position);
    removeShip(shipId);
    scene.removeFromParent();
    setSelectedEnemies({id: shipId, hull: 0, position: position, nearby: false}, true)
    explosionSound?.play();
    //setTimeout(() => {setDestroyed(false); setSelectedEnemies({ship: shipId, hull: 100})}, 10000)
  };
  const handleOnClick = (e: any) => {
    e.stopPropagation();
    if (e.ctrlKey) setFire(!fire);
    setDestination(
      meshRef?.current?.position || new Vector3(0, 0, 0),
      "Attack",
      "Ship"
    );
    setSelectedEnemies({
      id: shipId,
      hull: 100,
      position: meshRef?.current?.position || new Vector3(0, 0, 0),
      nearby: false,
    });
  };
  return (
    <group>
    <mesh position={position} ref={meshRef} onClick={handleOnClick}>
      <ShipHull shipId={shipId} destroyShip={destroyShip} />
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
        color={new Color("green")}
        origin={position}
      />
    </group>
  );
};
