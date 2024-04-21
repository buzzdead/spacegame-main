import create from 'zustand';
import { Vector3 } from 'three'
import { CelestialObjectId, ConstructionId, SpaceShipId } from './storeAssets';
import SpaceGameStateUtils, { CelestialObject, Construction, numberVector, SelectedShip, Ship } from './spaceGameStateUtils';
import shallow from 'zustand/shallow'

export type SGS = {
  CO: CelestialObject
  Ship: Ship
  Construction: Construction
  scale?: number
}

export interface SpaceGameState {
  celestialObjects: CelestialObject[];
  addCelestialObject: (coId: CelestialObjectId, position: numberVector, scale?: number) => void;
  ships: Ship[];
  addShip: (shipId: SpaceShipId, position: numberVector, scale?: number) => void;
  constructions: Construction[];
  addConstruction: (coId: ConstructionId, position: numberVector,  type: "Refinary" | "Construction", scale?: number) => void
  origin: Vector3 | undefined
  destination: Vector3 | undefined
  setOrigin: (pos: Vector3 | undefined) => void
  setDestination: (pos: Vector3) => void
  selected: SelectedShip[],
  setSelected: (id: string) => void
  resources: number
  setResources: (n: number) => boolean
}

const useStore = create<SpaceGameState>((set) => ({
  celestialObjects: [],
  addCelestialObject: (coId, position, scale) => set((state) => ({celestialObjects: SpaceGameStateUtils.addCelestialObjectToState(state.celestialObjects, coId, position, scale)})),
  ships: [],
  addShip: (shipId, position, scale) => set((state) => ({ ships: SpaceGameStateUtils.addShipToState(state.ships, shipId, position, scale)})),
  constructions: [],
  addConstruction: (coId, position, type = "Refinary", scale) => set((state) => ({constructions: SpaceGameStateUtils.addConstructionToState(state.constructions, coId, position, type, scale)})),
  origin: undefined,
  destination: undefined,
  setOrigin: (m: Vector3 | undefined) => set((state) => ({origin: m})),
  setDestination: (m: Vector3) => set((state) => ({destination: m})),
  selected: [],
  setSelected: (id: string) => set((state) => ({selected: SpaceGameStateUtils.addToSelected(state.ships, state.selected, id)})),
  resources: 150000,
  setResources: (n: number) => {
    let a = false
     set((state) => {
      const newResources = state.resources + n;
      const success = newResources >= 0;
      a = success
      return { resources: success ? newResources : state.resources };
    });
    return a
  }
}));


/* const useMulti = <T extends SpaceGameState, K extends keyof T>(
  state: T,
  ...items: K[]
): Pick<T, K> => {
  return items.reduce(
    (carry, item) => ({
      ...carry,
      [item]: state[item],
    }),
    {}
  ) as Pick<T, K>;
};

export const useStoreMulti = (...items: Array<keyof SpaceGameState>) => {
  const state = useStore((state) => state);
  return useMulti(state, ...items);
}; */

export const useShallowStore = <T extends (keyof SpaceGameState)[]>(parts: T) => {
  const shallowStore = useStore(state => {
    const obj = {} as { [K in T[number]]: SpaceGameState[K] }
    parts.forEach((p) => {
      //@ts-ignore
      obj[p] = state[p as keyof SpaceGameState];
    });
    return obj;
  }, shallow);
  return shallowStore;
};

export default useStore;
