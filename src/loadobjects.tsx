import { CelestialObjectId, SpaceShipId } from "./store/storeAssets";
import { LoadCelestialObjects } from "./loadcelestialobjects";
import { LoadShips } from "./loadships";
import { LoadConstructions } from "./loadConstructions";

interface Props {
    startPlanet: CelestialObjectId
    startShip: SpaceShipId
}

const LoadObjects = ({startPlanet, startShip}: Props) => {
   
    return (
        <group>
          <LoadCelestialObjects startPlanet={startPlanet}/>
          <LoadShips startShip={startShip}/>
          <LoadConstructions />
</group>
    )
}

export default LoadObjects