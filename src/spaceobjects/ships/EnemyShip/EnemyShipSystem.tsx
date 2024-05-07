import { useState } from "react";
import HeavyLaser from "../../weapons/HeavyLaser";
import { RadarScanner } from "./RadarScanner";
import * as THREE from "three";

interface Props {
  color: THREE.Color;
  origin: THREE.Vector3;
  nearby: boolean
  currentPos: THREE.Vector3
  shipRef: any
}

export const EnemyShipSystem = ({ color, origin, nearby, currentPos, shipRef }: Props) => {
    const [nearbyEnemies, setNearbyEnemies] = useState<THREE.Vector3[]>([])
  return (
    <group>
      {nearbyEnemies.length > 0 && <HeavyLaser shipRef={shipRef} color={color} origin={currentPos} target={nearbyEnemies[0]} />}
      <RadarScanner currentPos={currentPos} nearby={nearby} origin={origin} setNearbyEnemies={setNearbyEnemies}/>
    </group>
  );
};
