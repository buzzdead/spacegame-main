import { useEffect, useState } from "react";
import { useShallowStore } from "../../../store/UseStore";
import {  Vector3, Color, Group, Object3DEventMap } from "three";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import UseSoundEffect from "../../../hooks/SoundEffect";
import { ShipHull } from "./ShipHull";
import { EnemyShipSystem } from "./EnemyShipSystem";

interface Props {
  shipId: string
  eScene: Group<Object3DEventMap>
  position: Vector3
  nearby: boolean
}

export const EnemyShip = ({shipId, eScene, position, nearby}: Props) => {
  const { setDestination, setSelectedEnemies, removeShip, setExplosions } = useShallowStore(["setDestination", "setSelectedEnemies", "removeShip", "setExplosions"])
  const { camera, scene } = useThree()
  const [fire, setFire] = useState(false)
  const texture = useTexture.preload("/assets/fire.jpg");
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
    calculateExplosionSound(distance)
  }, [camera])

  const destroyShip = () => {
    setDestroyed(true);
    setExplosions(position)
    explosionSound?.play()
    setTimeout(() => setDestroyed(false),  5000)
  };
  const handleOnClick = (e: any) => {
    destroyShip();
    return;
    e.stopPropagation()
    if(e.ctrlKey) setFire(!fire)
    setDestination(position, "Attack");
    setSelectedEnemies({id: shipId, hull: 100, position: position, nearby: false});
  };
  if(destroyed) return null
  { return (
      <group onClick={handleOnClick}>
        <ShipHull shipId={shipId} destroyShip={destroyShip}/>
      <primitive object={eScene} />
     <EnemyShipSystem nearby={nearby} color={new Color('green')} origin={position} />
      </group>
  )
  }
};
