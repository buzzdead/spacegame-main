import { Vector3 } from "three";
import { useAsset } from "../../../hooks/useAsset";
import { EnemyShip } from "./EnemyShip";

interface Props {
  position: Vector3;
  id: string
}

export const EnemyShipScene = ({ position, id }: Props) => {
  const esScene = useAsset("/assets/spaceships/cruiser.glb", 1);
  esScene.position.copy(position);
  esScene.scale.set(0.1, 0.1, 0.1);
  return <EnemyShip position={position} eScene={esScene} shipId={id} />;
};
