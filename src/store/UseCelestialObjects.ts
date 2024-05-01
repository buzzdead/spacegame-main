import { StateCreator } from "zustand";
import SpaceGameStateUtils from "./SpaceGameStateUtils";
import { CelestialObjectState } from "./StoreState";
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