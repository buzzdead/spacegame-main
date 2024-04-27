import {create} from "zustand";
import {
  CelestialObject,
  Construction,
  Ship,
} from "./spaceGameStateUtils";
import shallow from "zustand/shallow";
import { SpaceGameState } from "./storeState";
import useCelestialObjects from "./useCelestialObjects";
import useConstructions from "./useConstructions";
import useOriginDestination from "./useOriginDestination";
import useResources from "./useResources";
import useShips from "./useShips";

export type SGS = {
  CO: CelestialObject;
  Ship: Ship;
  Construction: Construction;
  scale?: number;
};

const useStore = create<SpaceGameState>()((...a) => ({
  ...useCelestialObjects(...a),
  ...useConstructions(...a),
  ...useOriginDestination(...a),
  ...useResources(...a),
  ...useShips(...a)
}))

export const useShallowStore = <T extends (keyof SpaceGameState)[]>(
  parts: T
) => {
  const shallowStore = useStore((state) => {
    const obj = {} as { [K in T[number]]: SpaceGameState[K] };
    parts.forEach((p) => {
      //@ts-ignore
      obj[p] = state[p as keyof SpaceGameState];
    });
    return obj;
  }, shallow);
  return shallowStore;
};

export default useStore;
