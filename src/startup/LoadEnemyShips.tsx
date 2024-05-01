import { memo, useEffect } from "react";
import { SpaceShipId } from "../store/StoreAssets";
import useStore from "../store/UseStore";
import { Vector3 } from 'three'
import { EnemyShipScene } from "../spaceobjects/ships/EnemyShip/EnemyShipScene";
import { EnemyShip } from "../store/StoreState";

export const LoadEnemyShips = () => {
  const addEnemyShip = useStore((state) => state.addEnemyShip)
  const enemyShips = useStore((state) => state.enemyShips)

  interface ShipProps {
    ship: EnemyShip
  }
  
 /*  const MemoizedShip = memo(({ ship }: ShipProps) => <EnemyShipScene position={ship.position} id={ship.id} />, (prevProps, nextProps) => {
    return prevProps.ship.id === nextProps.ship.id &&
           // Add other properties that should trigger a re-render
           prevProps.ship.position.equals(nextProps.ship.position) &&
           prevProps.ship.hull === nextProps.ship.hull && 
           prevProps.ship.scale === nextProps.ship.scale
  }); */
  
  useEffect(() => {
    if(enemyShips.length > 0) return
    addEnemyShip(new Vector3(155, 55, 0))
    addEnemyShip(new Vector3(185, 55, 155))
    addEnemyShip(new Vector3(215, 55, 255))
    addEnemyShip(new Vector3(255, 85, 300))
  }, [addEnemyShip]);
  return (
    <group>
      {enemyShips.map((ship) => (
        <EnemyShipScene key={ship.id} position={ship.position} id={ship.id}/>
      ))}
    </group>
  );
};
