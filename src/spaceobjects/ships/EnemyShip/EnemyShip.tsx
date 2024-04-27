import { useEffect, useState } from "react";
import useStore, { useShallowStore } from "../../../store/useStore";
import {  Vector3, Color } from "three";
import { useThree } from "@react-three/fiber";
import { Explosion } from "../../tools/Explosion";
import { useTexture } from "@react-three/drei";
import UseSoundEffect from "../../../hooks/SoundEffect";
import { ShipHull } from "./ShipHull";
import HeavyLaser from "../../weapons/HeavyLaser";
import { RadarScanner } from "./RadarScanner";
import { EnemyShipSystem } from "./EnemyShipSystem";

interface Props {
  shipId: string
  eScene: any
  position: Vector3
}

export const EnemyShip = ({shipId, eScene, position}: Props) => {
  const { setDestination, setSelectedEnemies } = useShallowStore(["setDestination", "setSelectedEnemies"])
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
    console.log("what")
    setDestroyed(true);
    explosionSound?.play()
    //setTimeout(() => {setDestroyed(false); setSelectedEnemies({ship: shipId, hull: 100})}, 10000)
  };
  const handleOnClick = (e: any) => {
    e.stopPropagation()
    if(e.ctrlKey) setFire(!fire)
    setDestination(position);
    setSelectedEnemies({id: shipId, hull: 100, position: position});
  };

  {
    return destroyed ? (
      <Explosion position={position} />
    ) : (
      <group>
        <ShipHull shipId={shipId} destroyShip={destroyShip}/>
      <primitive onClick={handleOnClick} object={eScene} />
     <EnemyShipSystem color={new Color('green')} origin={position} />
      </group>
    );
  }
};
