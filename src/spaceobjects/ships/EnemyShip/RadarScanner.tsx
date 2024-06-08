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
  toggleNearBy: (b: boolean) => void
  distance: number
}

export const RadarScanner = ({
  setNearbyEnemies,
  nearby,
  shipRef,
  toggleNearBy,
  distance
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
          e.meshRef?.position?.distanceTo(shipRef.current.position) <= distance
      );
      const isNearby = nearbyShips.length > 0;

      if (isNearby !== nearby.current) toggleNearBy(isNearby);

      let abc = shipsNear.current.length
      shipsNear.current = nearbyShips;
      abc !== nearbyShips.length && setNearbyEnemies(nearbyShips);
    };

    const interval = setInterval(checkForNearByShips, 500);
    return () => clearInterval(interval);
  }, [ships, shipRef, nearby, toggleNearBy, setNearbyEnemies]);

  return null;
};

const MemoizedRadar = React.memo(RadarScanner, (prevProps, nextProps) => prevProps.distance === nextProps.distance);

export default MemoizedRadar;