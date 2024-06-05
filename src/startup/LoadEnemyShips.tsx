import { memo, useEffect, useState } from "react";
import { useShallowStore } from "../store/UseStore";
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
  const { developerMode, addEnemyShip, enemyShips } = useShallowStore(["developerMode", "addEnemyShip", "enemyShips"])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    if(enemyShips.length > 0) return
    addEnemyShip(new Vector3(35, 50, 675), 350)
    addEnemyShip(new Vector3(335, 50, 675), 350)
    addEnemyShip(new Vector3(55, 85, 675), 350)
    addEnemyShip(new Vector3(355, 85, 675), 350)
    addEnemyShip(new Vector3(100, 50, 250), 350)
    if(developerMode){
    addEnemyShip(new Vector3(255, 85, 300), 300)
    addEnemyShip(new Vector3(355, 85, 300), 300)
    addEnemyShip(new Vector3(455, 85, 300), 300)
    addEnemyShip(new Vector3(555, 85, 300), 300)
    addEnemyShip(new Vector3(655, 85, 300), 300)
    addEnemyShip(new Vector3(755, 85, 300), 300)
    addEnemyShip(new Vector3(855, 85, 300), 300)
    addEnemyShip(new Vector3(355, 185, 300), 300)
    addEnemyShip(new Vector3(455, 285, 300), 300)
    addEnemyShip(new Vector3(555, 385, 300), 300)
    addEnemyShip(new Vector3(655, 485, 300), 300)
    addEnemyShip(new Vector3(755, 585, 300), 300)
    addEnemyShip(new Vector3(855, 685, 300), 300)
    addEnemyShip(new Vector3(555, 85, 400), 300)
    addEnemyShip(new Vector3(655, 85, 500), 300)
    addEnemyShip(new Vector3(755, 85, 600), 300)
    addEnemyShip(new Vector3(855, 85, 700), 300)
    addEnemyShip(new Vector3(355, 185, 400), 300)
    addEnemyShip(new Vector3(455, 285, 500), 300)
    addEnemyShip(new Vector3(555, 385, 600), 300)
    addEnemyShip(new Vector3(655, 485, 700), 300)
    addEnemyShip(new Vector3(755, 585, 800), 300)
    addEnemyShip(new Vector3(855, 685, 900), 300)
  }
  setLoading(false)
  }, [addEnemyShip]);
  if(loading) return null
  return (
    <group>
      {enemyShips.map((ship) => (
        <MemoizedShip key={ship.id} ship={ship} />
      ))}
    </group>
  );
};
