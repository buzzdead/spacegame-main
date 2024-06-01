import { useEffect, useRef, useState } from "react";
import useStore from "../../../store/UseStore";
import { Vector3 } from "three";
import { EffectComposer } from "@react-three/postprocessing";
import { SWave } from "./swave";
import { useFrame } from "@react-three/fiber";
import { ObjectLocation } from "../../../store/storeSlices/UseOriginDestination";
import { Ship } from "../../../store/SpaceGameStateUtils";
import React from "react";

interface Props {
  setNearbyEnemies: (n: ObjectLocation[]) => void;
  origin: Vector3;
  nearby: boolean;
  currentPos: Vector3;
  id: string;
}

const RadarScanner = ({
  setNearbyEnemies,
  origin,
  nearby,
  currentPos,
  id,
}: Props) => {
  if (id === "4") console.log("radar", nearby);
  const ships = useStore((state) => state.ships);
  const shipsNear = useRef<Ship[]>([]);
  const toggleNearby = useStore((state) => state.toggleNearby);
  const groupRef = useRef<any>(null);
  const scanTimer = useRef(false);
  setTimeout(() => (scanTimer.current = true), 1500);

  useFrame(() => {
    if (!scanTimer.current) return;
    scanTimer.current = false;
    const checkForNearByShips = () => {
      const nearbyShips = ships.filter(
        (e) =>
          e.meshRef?.position &&
          e.meshRef?.position?.distanceTo(currentPos) <= 100
      );
      const isNearby = nearbyShips.length > 0;

      if (isNearby !== nearby) {
        toggleNearby(id, isNearby);
      }
      const isTheSameShips = shipsNear.current.map((s) =>
        nearbyShips.some((d) => d.id === s.id)
      );
      if (
        shipsNear.current.length > 0 &&
        isTheSameShips.length === shipsNear.current.length
      )
        return;
      setNearbyEnemies(nearbyShips);
      shipsNear.current = nearbyShips;
    };
    checkForNearByShips();

    setTimeout(() => (scanTimer.current = true), 1500);
  });

  return null;
  return (
    <group ref={groupRef}>
      {true && (
        <EffectComposer>
          <SWave pos={origin} scan={true} />
        </EffectComposer>
      )}
    </group>
  );
};

const MemoizedRadar = React.memo(RadarScanner, (prevProps, nextProps) => prevProps.nearby === nextProps.nearby)
export default MemoizedRadar