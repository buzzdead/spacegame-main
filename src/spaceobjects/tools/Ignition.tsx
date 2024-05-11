import { SpaceShipId } from "../../store/StoreAssets"
import RocketBooster from "./RocketBooster"
import { Vector3 } from 'three'

interface Props { type: SpaceShipId, brake?: boolean }

export const Ignition = ({type, brake = false}: Props) => {
  const isFighter = type === "fighter"
  const isHawk = type === "hawk"
  const rocketEngineLeft = 
  {
    x: isFighter ?  1.85 : 1.04 / 100,
    y: 0.75 / 100,
    z: isFighter ? -7.5 : isHawk ? -5 : -0.3
  }
  const rocketEngineRight = 
  {
    x: isFighter ? -1.86 : 1.04 / 100,
    y:  0.75 / 100,
    z: isFighter ? -7.5 : isHawk ? -6 : -0
  }
  if(type === "cruiser") {
    rocketEngineLeft.x -= 10
    rocketEngineLeft.z -= 25
    rocketEngineLeft.y += 1
  }
  const cruiserRockets = () => {
    const rockets = Array(4).fill(createVector3(rocketEngineLeft))
    const r2 = rockets.map((r, id) => {
      return <RocketBooster key={id} cruiser={true} brake={brake} position={new Vector3(r.x + (id + 1) * 4.6, r.y + id > 3 ? 2 : 1, r.z)}/>
    })
    return r2 || null
  }

  const createVector3 = (engine: {x: number, y: number, z: number}) => {
    return new Vector3(engine.x,engine.y,engine.z)
  }

    return (
        <group>
        <RocketBooster
        brake={brake}
        cruiser={type === "cruiser"}
          position={createVector3(rocketEngineLeft)}
        />
        {isFighter && <RocketBooster
          position={createVector3(rocketEngineRight)}
        />}
        {type === "cruiser" && cruiserRockets()}
      </group>
    )
}