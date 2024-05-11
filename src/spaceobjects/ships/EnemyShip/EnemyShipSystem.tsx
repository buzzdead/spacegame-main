import { useEffect, useState } from "react";
import HeavyLaser from "../../weapons/HeavyLaser";
import { RadarScanner } from "./RadarScanner";
import * as THREE from "three";
import { useThree } from '@react-three/fiber'
import { ObjectLocation } from "../../../store/UseOriginDestination";
import UseSoundEffect from "../../../hooks/SoundEffect";

interface Props {
  origin: THREE.Vector3;
  nearby: boolean
  currentPos: THREE.Vector3
  shipRef: any
}

export const EnemyShipSystem = ({ origin, nearby, currentPos, shipRef }: Props) => {
    const [nearbyEnemies, setNearbyEnemies] = useState<ObjectLocation[]>([])
    const { camera, scene } = useThree()
    const { sound: laserSound, calculateVolume: calculateLaserSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/laser.mp3",
    scene: scene,
    minVolume: 0.15,
    camera: camera,
    detune: -550
  });
  useEffect(() => {
    const distance = camera.position.distanceTo(currentPos)
    calculateLaserSound(distance)
  }, [camera, calculateLaserSound])
  return (
    <group>
      {nearbyEnemies.length > 0 && <HeavyLaser sound={laserSound} shipRef={shipRef} origin={currentPos} target={nearbyEnemies} />}
      <RadarScanner currentPos={currentPos} nearby={nearby} origin={origin} setNearbyEnemies={setNearbyEnemies}/>
    </group>
  );
};
