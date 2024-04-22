import { Vector3 } from 'three'
import { useAsset } from '../useAsset';
import { EnemyShip } from './EnemyShip';

interface Props {
    position: Vector3
}

export const EnemyShipScene = ({position}: Props) => {
    const esScene = useAsset("/assets/spaceships/cruiser.glb", 1);
    esScene.position.copy(position)
    esScene.scale.set(0.1, 0.1, 0.1);
    return <EnemyShip position={position} eScene={esScene} shipId={esScene.id} />
}