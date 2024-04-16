import { useEffect } from "react";
import useStore from "./store/useStore";
import CelestialObject from "./spaceobjects/CelestialObject";
import Ship from "./spaceobjects/Ship";
import Construction from "./spaceobjects/Construction";

interface Props {
    startPlanet: "planet1" | "planet2" | "planet3" | "planet5" | "planet6";
    startShip: "hullspaceship" | "spaceship-evil" | "cargo";
}

const Objects = ({startPlanet, startShip}: Props) => {
    const store = useStore()
    useEffect(() => {
        store.addCelestialObject(startPlanet, [-55, 0, -20], 50)
        store.addCelestialObject("asteroid", [0,5,0], 0.02)
        store.addCelestialObject("asteroid-minerals", [34, 5, 3], 2)
        store.addCelestialObject("asteroid-minerals", [34, 5, 12], 2)
        store.addCelestialObject("asteroid-minerals", [34, 5, 20], 2)
        store.addCelestialObject("asteroid-minerals", [34, 5, 32], 2)
        store.addCelestialObject("blackhole", [-166, 3, 246], 9)
        store.addShip(startShip, [8,1,4], 0.008)
        store.addShip(startShip, [10,2,8], 0.008)
        store.addShip(startShip, [12,3,12], 0.008)
        store.addConstruction("spacestation3", [14, 0, 64], "Construction", 0.11)
        store.addConstruction("spacestation2", [44, 6, 64], "Refinary", 0.055)
      }, [])
    return (
        <group>
        {store.celestialObjects.map((co) => (
            <CelestialObject key={co.id} celestialObject={co} />
          ))}
          {store.ships.map((ship) => (
            <Ship key={ship.id} ship={ship} />
          ))}
          {store.constructions.map((c) => (
            <Construction key={c.id} construction={c} />
          ))}
</group>
    )
}

export default Objects