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
  setResources: (n: number) => void
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
  resources: 0,
  setResources: (n: number) => set((state) => ({resources: state.resources + n}))
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
  const abc = useStore(state => {
    const obj = {} as { [K in T[number]]: SpaceGameState[K] } & SpaceGameState;
    parts.forEach((p) => {
      //@ts-ignore
      obj[p] = state[p as keyof SpaceGameState];
    });
    return obj;
  }, shallow);
  return abc;
};

export default useStore;
