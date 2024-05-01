import {StateCreator} from "zustand";
import SpaceGameStateUtils from "./SpaceGameStateUtils";
import { ConstructionState } from "./StoreState";

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