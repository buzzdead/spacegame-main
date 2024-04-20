import RocketBooster from "./RocketBooster"
import { Vector3 } from 'three'

interface Props { isFighter: boolean }

export const Ignition = ({isFighter}: Props) => {
    return (
        <group>
        <RocketBooster
          position={
            new Vector3(
              isFighter ? -3.3 : 1.04 / 100,
              0.75 / 100,
              isFighter ? -4.5 : -0.3
            )
          }
        />
        <RocketBooster
          position={
            new Vector3(
              isFighter ? -5.3 : 1.04 / 100,
              0.75 / 100,
              isFighter ? -4.5 : -0
            )
          }
        />
      </group>
    )
}