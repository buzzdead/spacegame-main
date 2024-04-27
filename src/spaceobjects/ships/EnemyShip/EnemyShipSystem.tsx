import { useState } from "react";
import HeavyLaser from "../../weapons/HeavyLaser";
import { RadarScanner } from "./RadarScanner";
import * as THREE from "three";

interface Props {
  color: THREE.Color;
  origin: THREE.Vector3;
}

export const EnemyShipSystem = ({ color, origin }: Props) => {
    const [nearbyEnemies, setNearbyEnemies] = useState<THREE.Vector3[]>([])
  return (
    <group>
      <HeavyLaser color={color} origin={origin} target={nearbyEnemies[0]} />
      <RadarScanner origin={origin} setNearbyEnemies={setNearbyEnemies}/>
    </group>
  );
};
