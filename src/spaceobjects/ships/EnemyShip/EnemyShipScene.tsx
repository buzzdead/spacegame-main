import { Vector3 } from "three";
import { useAsset } from "../../../hooks/Asset";
import { EnemyShip as ES } from "./EnemyShip";
import { EnemyShip } from "../../../store/StoreState";

interface Props {
  ship: EnemyShip
}

export const EnemyShipScene = ({ ship }: Props) => {
  const esScene = useAsset("/assets/spaceships/cruiser.glb", 1);
  esScene.scale.set(0.2, 0.2, 0.2);
  esScene.rotation.set(0, -1.55, 0);

  return <ES eScene={esScene} enemyShip={ship} rotation={ship.rotation}/>;
};
