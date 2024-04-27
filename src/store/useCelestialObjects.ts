import { StateCreator } from "zustand";
import SpaceGameStateUtils from "./spaceGameStateUtils";
import { CelestialObjectState } from "./storeState";
const useCelestialObjects: StateCreator<
CelestialObjectState,
  [],
  [],
  CelestialObjectState
> = (set) => ({
  celestialObjects: [],
  addCelestialObject: (coId, position, scale) =>
    set((state) => ({
      celestialObjects: SpaceGameStateUtils.addCelestialObjectToState(
        state.celestialObjects,
        coId,
        position,
        scale
      ),
    })),
})

export default useCelestialObjects;