import {create} from "zustand";
import {
  CelestialObject,
  Construction,
  Ship,
} from "./SpaceGameStateUtils";
import {shallow} from "zustand/shallow";
import { SpaceGameState } from "./StoreState";
import useCelestialObjects from "./storeSlices/UseCelestialObjects";
import useConstructions from "./storeSlices/UseConstructions";
import useOriginDestination from "./storeSlices/UseOriginDestination";
import useResources from "./storeSlices/UseResources";
import useShips from "./storeSlices/UseShips";
import useOptions from './storeSlices/UseOptions'
import useEffects from "./storeSlices/useEffects";
import useMissions from "./storeSlices/useMissions";
import useUser from "./storeSlices/useUser";

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
  ...useOptions(...a),
  ...useEffects(...a),
  ...useMissions(...a),
  ...useUser(...a)
}))

/* export const useShallowStore = <T extends (keyof SpaceGameState)[]>(
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
}; */

export default useStore;


export const useShallowStore = <T extends (keyof SpaceGameState)[]>(
  parts: T
) => {
  const shallowStore = useStore((state) => {
    return parts.reduce((obj, p) => {
      return { ...obj, [p]: state[p] };
    }, {} as { [K in T[number]]: SpaceGameState[K] });
  }, shallow);
  return shallowStore;
};
