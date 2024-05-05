import {StateCreator} from "zustand";
import SpaceGameStateUtils from "./SpaceGameStateUtils";
import { ConstructionState } from "./StoreState";
import { Vector3 } from 'three'
import { constructions } from "./StoreAssets";

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
    removeConstruction: (coId: string) => 
      set((state) => ({
         constructions: state.constructions.filter(c => c.id !== coId)
      })),
    dealDamageToConstruction: (pos: Vector3, n: number ) => {
      let destroyed = false;
      set((state) => {
        const construction = state.constructions.find(c => c.position === pos)
        if(!construction) return { constructions: state.constructions}
        construction.hull = construction.hull - n;
        destroyed = construction.hull <= 0
        const constructionReturn = state.constructions.map(s => s.id === construction.id ? construction : s)
        return { constructions: constructionReturn }
      });
      return destroyed;
    },
})


export default useConstructions;