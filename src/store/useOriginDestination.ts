import { StateCreator } from "zustand";
import { Vector3 } from 'three'
import { LocationState } from "./storeState";

const useOriginDestination: StateCreator<
  LocationState,
  [],
  [],
  LocationState
> = (set) => ({
  origin: undefined,
  destination: undefined,
  setOrigin: (m: Vector3 | undefined) => set((state) => ({ origin: m })),
  setDestination: (m: Vector3) => set((state) => ({ destination: m === state.destination ? undefined : m })),
})

export default useOriginDestination;