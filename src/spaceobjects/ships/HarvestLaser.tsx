import RocketBooster from "./RocketBooster"
import { Vector3 } from 'three'

interface Props {
    isHarvesting: boolean
}

export const HarvestLaser = ({isHarvesting}: Props) => {
    return (
        <group>
            <RocketBooster
              isHarvesting={isHarvesting}
              position={new Vector3(1.04 / 100, 0.75 / 100, 4.75)}
            />
            <RocketBooster
              isHarvesting={isHarvesting}
              position={new Vector3(1.04 / 100, 0.75 / 100, 5.25)}
            />
            <RocketBooster
              isHarvesting={isHarvesting}
              position={new Vector3(1.04 / 100, 0.75 / 100, 5.75)}
            />
          </group>
    )
}