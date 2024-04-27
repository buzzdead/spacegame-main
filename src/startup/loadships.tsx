import { useEffect } from "react";
import { SpaceShipId } from "../store/storeAssets";
import useStore from "../store/useStore";
import { ShipScene } from "../spaceobjects/ships/ShipScene";

interface Props {
  startShip: SpaceShipId;
}

export const LoadShips = ({ startShip }: Props) => {
  const ships = useStore((state) => state.ships);
  const addShip = useStore((state) => state.addShip);
  useEffect(() => {
    addShip(startShip, [8, 1, 4], 100, 0.008);
    addShip(startShip, [10, 2, 8], 100, 0.008);
    addShip(startShip, [12, 3, 12], 100, 0.008);
  }, [addShip, startShip]);
  return (
    <group>
      {ships.map((ship) => (
        <ShipScene key={ship.id} ship={ship} />
      ))}
    </group>
  );
};
