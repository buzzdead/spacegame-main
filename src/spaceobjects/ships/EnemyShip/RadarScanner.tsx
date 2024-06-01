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
  nearby: any;
  shipRef: any;
  id: string;
  toggleNearBy: (b: boolean) => void
}

export const RadarScanner = ({
  setNearbyEnemies,
  nearby,
  shipRef,
  id,
  toggleNearBy
}: Props) => {
  const ships = useStore((state) => state.ships);
  const shipsNear = useRef<Ship[]>([]);
  const groupRef = useRef<any>(null);

  useEffect(() => {
    const checkForNearByShips = () => {
      if (!shipRef.current) return;
      const nearbyShips = ships.filter(
        (e) =>
          e.meshRef?.position &&
          e.meshRef?.position?.distanceTo(shipRef.current.position) <= 100
      );
      const isNearby = nearbyShips.length > 0;

      if (isNearby !== nearby.current) toggleNearBy(isNearby);

      shipsNear.current = nearbyShips;
      setNearbyEnemies(nearbyShips);
    };

    const interval = setInterval(checkForNearByShips, 1000);
    return () => clearInterval(interval);
  }, [ships, shipRef, nearby, toggleNearBy, setNearbyEnemies]);

  return null;
};

const MemoizedRadar = React.memo(RadarScanner, () => true);

export default MemoizedRadar;