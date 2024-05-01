import { useEffect } from "react";
import { SpaceShipId } from "../store/StoreAssets";
import useStore from "../store/UseStore";
import { Vector3 } from 'three'
import { EnemyShipScene } from "../spaceobjects/ships/EnemyShip/EnemyShipScene";

export const LoadEnemyShips = () => {
  const addEnemyShip = useStore((state) => state.addEnemyShip)
  const enemyShips = useStore((state) => state.enemyShips)
  
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
        <EnemyShipScene key={ship.id} id={ship.id} position={ship.position}/>
      ))}
    </group>
  );
};
