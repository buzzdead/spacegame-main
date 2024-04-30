import {StateCreator} from "zustand";
import SpaceGameStateUtils from "./spaceGameStateUtils";
import { OptionsState } from "./storeState";

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