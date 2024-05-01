import {create} from "zustand";
import {
  CelestialObject,
  Construction,
  Ship,
} from "./SpaceGameStateUtils";
import {shallow} from "zustand/shallow";
import { SpaceGameState } from "./StoreState";
import useCelestialObjects from "./UseCelestialObjects";
import useConstructions from "./UseConstructions";
import useOriginDestination from "./UseOriginDestination";
import useResources from "./UseResources";
import useShips from "./UseShips";
import useOptions from './UseOptions'

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
  ...useShips(...a),
  ...useOptions(...a)
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
