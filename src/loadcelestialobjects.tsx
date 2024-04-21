import { useEffect } from "react";
import { CelestialObjectId } from "./store/storeAssets";
import useStore from "./store/useStore";
import CelestialObject from "./spaceobjects/CelestialObject";

interface Props {
  startPlanet: CelestialObjectId;
}

export const LoadCelestialObjects = ({ startPlanet }: Props) => {
  const celestialObjects = useStore((state) => state.celestialObjects);
  const addCelestialObject = useStore((state) => state.addCelestialObject);
  useEffect(() => {
    addCelestialObject(startPlanet, [-55, 0, -20], 50);
    addCelestialObject("asteroid-minerals", [34, 5, 3], 2);
    addCelestialObject("asteroid-minerals", [34, 5, 12], 2);
    addCelestialObject("asteroid-minerals", [34, 5, 20], 2);
    addCelestialObject("asteroid-minerals", [34, 5, 32], 2);
    addCelestialObject("blackhole", [-1606, 3, 246], 18);
  }, []);
  return (
    <group>
      {celestialObjects.map((co) => (
        <CelestialObject key={co.id} celestialObject={co} />
      ))}
    </group>
  );
};
