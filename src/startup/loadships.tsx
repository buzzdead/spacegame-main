import { useEffect } from "react";
import { SpaceShipId } from "../store/storeAssets";
import useStore from "../store/useStore";
import { ShipScene } from "../spaceobjects/ships/ShipScene";
import { Vector3 } from 'three'
import { EnemyShipScene } from "../spaceobjects/ships/EnemyShip/EnemyShipScene";

interface Props {
  startShip: SpaceShipId;
}

export const LoadShips = ({ startShip }: Props) => {
  const ships = useStore((state) => state.ships);
  const addShip = useStore((state) => state.addShip);
  const addEnemyShip = useStore((state) => state.addEnemyShip)
  const enemyShips = useStore((state) => state.enemyShips)
  console.log(enemyShips)
  useEffect(() => {
    if(ships.length > 0) return
    addShip(startShip, [8, 1, 4], 100, 0.014);
    addShip(startShip, [10, 2, 8], 100, 0.014);
    addShip(startShip, [12, 3, 12], 100, 0.014);
    addEnemyShip(new Vector3(155, 55, 0))
    addEnemyShip(new Vector3(185, 55, 155))
    addEnemyShip(new Vector3(215, 55, 255))
    addEnemyShip(new Vector3(255, 85, 300))
  }, [addShip, startShip]);
  return (
    <group>
      {ships.map((ship) => (
        <ShipScene key={ship.id} ship={ship} />
      ))}
      {enemyShips.map((ship) => (
        <EnemyShipScene key={ship.id} id={ship.id} position={ship.position}/>
      ))}
    </group>
  );
};
