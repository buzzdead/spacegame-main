import { StateCreator } from "zustand";
import { Vector3 } from 'three'
import { DestinationType, LocationState } from "./storeState";

const useOriginDestination: StateCreator<
  LocationState,
  [],
  [],
  LocationState
> = (set) => ({
  origin: undefined,
  destination: undefined,
  setOrigin: (m: Vector3 | undefined) => set((state) => ({ origin: m })),
  setDestination: (m: Vector3, type: DestinationType) => set((state) => ({ destination: m === state.destination?.pos ? undefined : { pos: m, type: type}})),
})

export default useOriginDestination;