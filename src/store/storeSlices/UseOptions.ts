import {StateCreator} from "zustand";
import SpaceGameStateUtils from "../SpaceGameStateUtils";
import { OptionsState } from "../StoreState";

const useOptions: StateCreator<
  OptionsState,
  [],
  [],
  OptionsState
> = (set) => ({
  postProcessing: true,
  developerMode: false,
  setPostProcessing: () => {
    set((state) => ({postProcessing: !state.postProcessing}))
  },
  setDeveloperMode: () => {
    set((state) => ({developerMode: !state.developerMode}))
  }
})


export default useOptions;