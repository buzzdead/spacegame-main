import React, { memo, useEffect } from "react";
import { SpaceShipId } from "../store/StoreAssets";
import useStore from "../store/UseStore";
import { ShipScene } from "../spaceobjects/ships/ShipScene";
import { LoadEnemyShips } from "./LoadEnemyShips";
import { Ship } from "../store/SpaceGameStateUtils";

interface Props {
  startShip: SpaceShipId;
}

interface ShipProps {
  ship: Ship
}

const MemoizedShip = memo(({ ship }: ShipProps) => <ShipScene ship={ship} />, (prevProps, nextProps) => {
  return prevProps.ship.id === nextProps.ship.id &&
         // Add other properties that should trigger a re-render
         prevProps.ship.position.equals(nextProps.ship.position) &&
         prevProps.ship.hull === nextProps.ship.hull && 
         prevProps.ship.scale === nextProps.ship.scale
});

export const LoadShips = ({ startShip }: Props) => {
  const ships = useStore((state) => state.ships);
  const addShip = useStore((state) => state.addShip);

  useEffect(() => {
    if (ships.length > 0) return;
    addShip(startShip, [8, 1, 0], 100, 0.014);
    addShip(startShip, [10, 2, 12], 100, 0.014);
    addShip(startShip, [12, 3, 24], 100, 0.014);
  }, [addShip, startShip, ships.length]);

  return (
    <group>
      {ships.map((ship) => (
        <MemoizedShip key={ship.id} ship={ship} />
      ))}
      <LoadEnemyShips />
    </group>
  );
};