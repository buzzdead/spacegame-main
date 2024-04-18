import { useEffect } from "react";
import { SpaceShipId } from "./store/storeAssets";
import useStore from "./store/useStore";
import Ship from "./spaceobjects/Ship";

interface Props {
  startShip: SpaceShipId;
}

export const LoadShips = ({ startShip }: Props) => {
  const ships = useStore((state) => state.ships);
  const addShip = useStore((state) => state.addShip);
  useEffect(() => {
    addShip(startShip, [8, 1, 4], 0.008);
    addShip(startShip, [10, 2, 8], 0.008);
    addShip(startShip, [12, 3, 12], 0.008);
  }, []);
  return (
    <group>
      {ships.map((ship) => (
        <Ship key={ship.id} ship={ship} />
      ))}
    </group>
  );
};
