import { SpaceShipId } from "../../store/StoreAssets"
import RocketBooster from "./RocketBooster"
import { Vector3 } from 'three'

interface Props { type: SpaceShipId }

export const Ignition = ({type}: Props) => {
  const isFighter = type === "fighter"
  const isHawk = type === "hawk"
  const rocketEngineLeft = 
  {
    x: isFighter ?  -6 : 1.04 / 100,
    y: 0.75 / 100,
    z: isFighter ? -7.5 : isHawk ? -5 : -0.3
  }
  const rocketEngineRight = 
  {
    x: isFighter ? -9.6 : 1.04 / 100,
    y:  0.75 / 100,
    z: isFighter ? -7.5 : isHawk ? -6 : -0
  }

  const createVector3 = (engine: {x: number, y: number, z: number}) => {
    return new Vector3(engine.x,engine.y,engine.z)
  }

    return (
        <group>
        <RocketBooster
          position={createVector3(rocketEngineLeft)}
        />
        {isFighter && <RocketBooster
          position={createVector3(rocketEngineRight)}
        />}
      </group>
    )
}