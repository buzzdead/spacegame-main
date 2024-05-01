import { useEffect } from "react";
import { SpaceShipId } from "../store/StoreAssets";
import useStore from "../store/UseStore";
import { ShipScene } from "../spaceobjects/ships/ShipScene";
import { Vector3 } from 'three'
import { EnemyShipScene } from "../spaceobjects/ships/EnemyShip/EnemyShipScene";
import { LoadEnemyShips } from "./LoadEnemyShips";

interface Props {
  startShip: SpaceShipId;
}

export const LoadShips = ({ startShip }: Props) => {
  const ships = useStore((state) => state.ships);
  const addShip = useStore((state) => state.addShip);

  useEffect(() => {
    if(ships.length > 0) return
    addShip(startShip, [8, 1, 0], 100, 0.014);
    addShip(startShip, [10, 2, 12], 100, 0.014);
    addShip(startShip, [12, 3, 24], 100, 0.014);
  }, [addShip, startShip]);
  return (
    <group>
      {ships.map((ship) => (
        <ShipScene key={ship.id} ship={ship} />
      ))}
      <LoadEnemyShips />
    </group>
  );
};
