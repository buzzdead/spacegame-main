import { SpaceShipId } from "../../store/StoreAssets";
import RocketBooster from "./RocketBooster";
import { Vector3 } from 'three';

type Position = [number, number, number];

interface RocketBoosterConfig {
  position: Position;
  cruiser?: boolean;
}

interface ShipConfig {
  rocketBoosters: RocketBoosterConfig[];
}

const SHIP_CONFIGS: Partial<Record<SpaceShipId, ShipConfig>> = {
  fighter: {
    rocketBoosters: [
      { position: [1.85, 0.0075, -6.5] },
      { position: [-1.86, 0.0075, -6.5] }
    ]
  },
  hawk: {
    rocketBoosters: [
      { position: [0.0104, 0.0075, -5] }
    ]
  },
  cargo: {
    rocketBoosters: [
      { position: [0.0104, 0.0075, -3.5] }
    ]
  },
  cruiser: {
    rocketBoosters: [
      { position: [-9.96, 1.75, -25], cruiser: true },
      { position: [-5, 1.75, -25], cruiser: true },
      { position: [-0.84, 1.75, -25], cruiser: true },
      { position: [3.8, 1.75, -25], cruiser: true },
      { position: [8.54, 2.5, -25], cruiser: true }
    ]
  },
  heavyfighter: {
    rocketBoosters: [
      { position: [2.25, 0.3175, -18.5] },
      { position: [-3.05, 0.3175, -18.5] },
    ]
  }
};

interface Props {
  type: SpaceShipId;
  brake?: boolean;
}

const arrayToVector3 = ([x, y, z]: Position): Vector3 => new Vector3(x, y, z);

export const Ignition = ({ type, brake = false }: Props) => {
  const config = SHIP_CONFIGS[type];

  return (
    <group>
      {config?.rocketBoosters.map((booster, index) => (
        <RocketBooster
          key={index}
          brake={brake}
          cruiser={booster.cruiser}
          position={arrayToVector3(booster.position)}
        />
      ))}
    </group>
  );
};