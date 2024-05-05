import { memo, useEffect } from "react";
import { CelestialObjectId } from "../store/StoreAssets";
import useStore from "../store/UseStore";
import CelestialObject from "../spaceobjects/CelestialObject";
import { CelestialObject as CO } from "../store/SpaceGameStateUtils";

interface Props {
  startPlanet: CelestialObjectId;
}

interface COProps {
  co: CO
}

const MemoizedCO = memo(({ co }: COProps) => <CelestialObject celestialObject={co} />, (prevProps, nextProps) => {
  return prevProps.co.id === nextProps.co.id 
});

export const LoadCelestialObjects = ({ startPlanet }: Props) => {
  const celestialObjects = useStore((state) => state.celestialObjects);
  const addCelestialObject = useStore((state) => state.addCelestialObject);
  useEffect(() => {
    addCelestialObject(startPlanet, [-305, 0, -80], 125);
    addCelestialObject("planet5", [100, 50, 1000], 125)
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
        <MemoizedCO key={co.id} co={co} />
      ))}
    </group>
  );
};
