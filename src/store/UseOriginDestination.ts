import { StateCreator } from "zustand";
import { Vector3 } from 'three'
import { DestinationType, LocationState, ObjectType } from "./StoreState";

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