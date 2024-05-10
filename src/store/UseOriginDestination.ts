import { StateCreator } from "zustand";
import { Vector3 } from 'three'
import { DestinationType, EnemyShip, LocationState, ObjectType } from "./StoreState";
import { CelestialObject, Construction, Ship } from "./SpaceGameStateUtils";

type ObjectLocation = Ship | EnemyShip | Construction | CelestialObject

const useOriginDestination: StateCreator<
  LocationState,
  [],
  [],
  LocationState
> = (set) => ({
  origin: undefined,
  destination: undefined,
  setOrigin: (m: Vector3 | undefined) => set((state) => ({ origin: m })),
  setDestination: (m: Vector3, type: DestinationType, objectType: ObjectType) => set((state) => ({ destination: m === state.destination?.pos ? undefined : { pos: m, type: type, objectType}})),
})

export default useOriginDestination;