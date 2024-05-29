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
  stats: false,
  brightness: 0.35,
  setPostProcessing: () => {
    set((state) => ({postProcessing: !state.postProcessing}))
  },
  setDeveloperMode: () => {
    set((state) => ({developerMode: !state.developerMode}))
  },
  setStats: () => {
    set((state) => ({stats: !state.stats}))
  },
  setBrightness: (n: number) => {
    set((state) => ({brightness: (n > 0 && n < 1) ? n : state.brightness}))
  }
})


export default useOptions;