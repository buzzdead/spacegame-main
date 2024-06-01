import { useEffect, useRef, useState } from "react";
import useStore from "../../../store/UseStore";
import { useFrame } from '@react-three/fiber'

interface Props {
  shipId: string;
  destroyShip: () => void;
  friend?: boolean
  hullRef?: any
}
export const ShipHull = ({ shipId, destroyShip, hullRef }: Props) => {
  const ships = useStore((state) => state.enemyShips);
  const selectedShip = ships?.find(s => s.id.toString() === shipId.toString())
  const destroyed = useRef(false)
  useFrame(() => {
    if(!selectedShip || destroyed.current || !selectedShip.meshRef) return
    if(selectedShip.meshRef.hull <= 0) {destroyed.current = true; destroyShip();}
  })
return null
};
