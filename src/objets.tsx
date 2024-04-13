import React, { useEffect } from "react";
import useStore from "./store/useStore";
import { Canvas } from "@react-three/fiber";
import { Typography } from 'antd';
import CelestialObject from "./spaceobjects/CelestialObject";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
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
        store.addCelestialObject("asteroid", [0,5,0], 0.01)
        store.addCelestialObject("asteroid-minerals", [34, 5, 3])
        store.addCelestialObject("asteroid-minerals", [34, 5, 6])
        store.addCelestialObject("asteroid-minerals", [34, 5, 9])
        store.addCelestialObject("asteroid-minerals", [34, 5, 12])
        store.addCelestialObject("blackhole", [-166, 3, 246], 9)
        store.addShip(startShip, [8,1,0], 0.004)
        store.addShip(startShip, [10,2,0], 0.004)
        store.addShip(startShip, [12,3,0], 0.004)
        store.addConstruction("spacestation3", [14, 0, 34], 0.055)
        store.addConstruction("spacestation2", [24, 6, 64], 0.055)
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