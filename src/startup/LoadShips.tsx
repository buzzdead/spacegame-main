import { memo, useEffect, useState } from "react";
import { SpaceShipId } from "../store/StoreAssets";
import { useShallowStore } from "../store/UseStore";
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
  const [loading, setLoading] = useState(true)
  const { ships, addShip } = useShallowStore(["ships", "addShip"])

  useEffect(() => {
    if (ships.length > 0) return;
    addShip(startShip, [8, 1, 0], 0.1);
    addShip(startShip, [10, 2, 12], 0.1);
    addShip(startShip, [12, 3, 24], 0.1);
    addShip("fighter", [55, 15, 55], 20)
    addShip("fighter", [55, 15, 25], 20)
    setLoading(false)
  }, []);

  if(loading) return null

  return (
    <group>
      {ships.map((ship) => (
        <MemoizedShip key={ship.id} ship={ship} />
      ))}
      <ShipShifter />
    </group>
  );
};