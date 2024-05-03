import {StateCreator} from "zustand";
import SpaceGameStateUtils from "./SpaceGameStateUtils";
import { Vector3 } from 'three'
import { EffectsState, OptionsState } from "./StoreState";

const useEffects: StateCreator<
  EffectsState,
  [],
  [],
  EffectsState
> = (set) => ({
  explosions: [],
  setExplosions: (newExplosion: Vector3, remove = false) => {
    set((state) => ({explosions: remove ? [...state.explosions.filter(e => e !== newExplosion)] : [...state.explosions, newExplosion]}))
  },
})


export default useEffects;