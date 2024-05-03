import {StateCreator} from "zustand";
import SpaceGameStateUtils from "./SpaceGameStateUtils";
import { OptionsState } from "./StoreState";

const useOptions: StateCreator<
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


export default useOptions;