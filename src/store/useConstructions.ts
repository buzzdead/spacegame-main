import {StateCreator} from "zustand";
import SpaceGameStateUtils from "./spaceGameStateUtils";
import { ConstructionState } from "./storeState";

const useConstructions: StateCreator<
  ConstructionState,
  [],
  [],
  ConstructionState
> = (set) => ({
  constructions: [],
  addConstruction: (coId, position, type = "Refinary", scale) =>
    set((state) => ({
      constructions: SpaceGameStateUtils.addConstructionToState(
        state.constructions,
        coId,
        position,
        type,
        scale
      ),
    })),
})


export default useConstructions;