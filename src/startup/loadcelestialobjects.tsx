import { useEffect } from "react";
import { CelestialObjectId } from "../store/storeAssets";
import useStore from "../store/useStore";
import CelestialObject from "../spaceobjects/CelestialObject";

interface Props {
  startPlanet: CelestialObjectId;
}

export const LoadCelestialObjects = ({ startPlanet }: Props) => {
  const celestialObjects = useStore((state) => state.celestialObjects);
  const addCelestialObject = useStore((state) => state.addCelestialObject);
  useEffect(() => {
    addCelestialObject(startPlanet, [-305, 0, -80], 65);
    addCelestialObject("planet5", [100, 50, 1000], 50)
    addCelestialObject("asteroid-minerals", [34, 5, 3], 3.5);
    addCelestialObject("asteroid-minerals", [34, 5, 12], 3.5);
    addCelestialObject("asteroid-minerals", [34, 5, 20], 3.5);
    addCelestialObject("asteroid-minerals", [34, 5, 32], 3.5);
    addCelestialObject("blackhole", [-2606, 3, 246], 36);
    addCelestialObject("sun1", [-5000, 0, 14999], 100)
  }, [addCelestialObject, startPlanet]);
  return (
    <group>
      {celestialObjects.map((co) => (
        <CelestialObject key={co.id} celestialObject={co} />
      ))}
    </group>
  );
};
