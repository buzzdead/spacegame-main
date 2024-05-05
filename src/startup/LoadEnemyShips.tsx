import { memo, useEffect } from "react";
import useStore from "../store/UseStore";
import { Vector3 } from 'three'
import { EnemyShipScene } from "../spaceobjects/ships/EnemyShip/EnemyShipScene";
import { EnemyShip } from "../store/StoreState";

interface ShipProps {
  ship: EnemyShip
}

const MemoizedShip = memo(({ ship }: ShipProps) => <EnemyShipScene ship={ship} />, (prevProps, nextProps) => {
  return prevProps.ship.id === nextProps.ship.id && prevProps.ship.nearby === nextProps.ship.nearby
});

export const LoadEnemyShips = () => {
  const addEnemyShip = useStore((state) => state.addEnemyShip)
  const enemyShips = useStore((state) => state.enemyShips)
  
  useEffect(() => {
    if(enemyShips.length > 0) return
    addEnemyShip(new Vector3(35, 50, 675), 75)
    addEnemyShip(new Vector3(185, 55, 155), 100)
    //addEnemyShip(new Vector3(215, 55, 255), 100)
    //addEnemyShip(new Vector3(255, 85, 300), 100)
  }, [addEnemyShip]);
  return (
    <group>
      {enemyShips.map((ship) => (
        <MemoizedShip key={ship.id} ship={ship} />
      ))}
    </group>
  );
};
