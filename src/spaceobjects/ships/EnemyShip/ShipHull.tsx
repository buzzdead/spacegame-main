import { useEffect, useState } from "react";
import useStore from "../../../store/UseStore";

interface Props {
  shipId: string;
  destroyShip: () => void;
  friend?: boolean
}
export const ShipHull = ({ shipId, destroyShip, friend = false }: Props) => {
  const selectedEnemies = useStore((state) => friend ? state.ships : state.selectedEnemies);
  useEffect(() => {
    if (selectedEnemies.length === 0) return;
    //@ts-ignore
    const s =  selectedEnemies?.find((e) => e.id.toString() === shipId.toString());

    if (s && s?.hull <= 0) destroyShip()
  }, [selectedEnemies]);
return null
};
