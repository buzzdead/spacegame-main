import { Vector3 } from "three";
import { useAsset } from "../../../hooks/Asset";
import { EnemyShip as ES } from "./EnemyShip";
import { EnemyShip } from "../../../store/StoreState";

interface Props {
  ship: EnemyShip
}

export const EnemyShipScene = ({ ship }: Props) => {
  const esScene = useAsset("/assets/spaceships/cruiser.glb", 1);
  esScene.position.copy(ship.position);
  esScene.scale.set(0.2, 0.2, 0.2);
  return <ES nearby={ship.nearby} position={ship.position} eScene={esScene} shipId={ship.id} />;
};
