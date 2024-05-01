import {StateCreator} from "zustand";
import SpaceGameStateUtils from "./SpaceGameStateUtils";
import { OptionsState } from "./StoreState";

const useConstructions: StateCreator<
  OptionsState,
  [],
  [],
  OptionsState
> = (set) => ({
  postProcessing: false,
  setPostProcessing: () => {
    set((state) => ({postProcessing: !state.postProcessing}))
  },
})


export default useConstructions;