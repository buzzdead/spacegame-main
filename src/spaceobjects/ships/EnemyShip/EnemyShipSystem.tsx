import { useEffect, useRef, useState } from "react";
import HeavyLaser from "../../weapons/HeavyLaser";
import { RadarScanner } from "./RadarScanner";
import * as THREE from "three";
import { useThree, useFrame } from '@react-three/fiber'
import { ObjectLocation } from "../../../store/UseOriginDestination";
import UseSoundEffect from "../../../hooks/SoundEffect";
import { TheBeam } from "../../weapons/TheBeam";

interface Props {
  origin: THREE.Vector3;
  nearby: boolean
  currentPos: THREE.Vector3
  shipRef: any
}

export const EnemyShipSystem = ({ origin, nearby, currentPos, shipRef }: Props) => {
    const [nearbyEnemies, setNearbyEnemies] = useState<ObjectLocation[]>([])
    const lookingAtTarget = useRef(false)
    const { camera, scene } = useThree()
    useFrame(() => {
      if(!nearby || !nearbyEnemies[0]?.meshRef?.position) return
      const direction = new THREE.Vector3()
      .subVectors(nearbyEnemies[0]?.meshRef?.position, origin)
      .normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      direction
    );
    const angle = shipRef.current.quaternion.angleTo(targetQuaternion);
    lookingAtTarget.current = angle < 0.25
    shipRef.current.quaternion.slerp(targetQuaternion, 0.005);
    })
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
      {nearby && <TheBeam nearbyRef={lookingAtTarget} position={shipRef.current?.position || origin} rotation={shipRef.current?.rotation || new THREE.Vector3(0,0,0)}/>}
    </group>
  );
};
