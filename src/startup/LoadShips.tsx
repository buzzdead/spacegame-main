import React, { memo, useEffect } from "react";
import { SpaceShipId } from "../store/StoreAssets";
import useStore, { useShallowStore } from "../store/UseStore";
import { ShipScene } from "../spaceobjects/ships/ShipScene";
import { Ship } from "../store/SpaceGameStateUtils";
import { ShipShifter } from "./ShipShifter";

interface Props {
  startShip: SpaceShipId;
}

interface ShipProps {
  ship: Ship
}

const MemoizedShip = memo(({ ship }: ShipProps) => <ShipScene ship={ship} />, (prevProps, nextProps) => {
  return prevProps.ship.id === nextProps.ship.id 
});

export const LoadShips = ({ startShip }: Props) => {
  const { ships, addShip } = useShallowStore(["ships", "addShip"])

  useEffect(() => {
    if (ships.length > 0) return;
    addShip(startShip, [8, 1, 0], 100, 0.1);
    addShip(startShip, [10, 2, 12], 100, 0.1);
    addShip(startShip, [12, 3, 24], 100, 0.1);
    addShip("fighter", [55, 15, 55], 100, 20)
  }, [addShip, startShip, ships.length]);

  return (
    <group>
      {ships.map((ship) => (
        <MemoizedShip key={ship.id} ship={ship} />
        
      ))}
      <ShipShifter />
    </group>
  );
};