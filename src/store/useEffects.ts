import { StateCreator } from "zustand";
import { Vector3 } from 'three';
import { EffectsState } from "./StoreState";

export type ExplosionSize = "Big" | "Medium" | "Small";

interface Explosion {
  id: number;
  pos: Vector3;
  size: ExplosionSize;
}

const useEffects: StateCreator<
  EffectsState,
  [],
  [],
  EffectsState
> = (set, get) => {
  let nextId = 0; // This will be used to assign unique IDs to each explosion
  let removalQueue: number[] = []; // Queue to hold IDs of explosions to be removed
  let removalTimeout: number | null = null; // Reference to the timeout for processing the queue

  const processRemovalQueue = () => {
    set((state) => ({
      explosions: state.explosions.filter(explosion => !removalQueue.includes(explosion.id))
    }));
    removalQueue = []; // Clear the queue after processing
    removalTimeout = null; // Reset the timeout reference
  };

  return {
    explosions: [],
    setExplosions: (pos: Vector3, size: ExplosionSize = "Medium") => {
      const explosion: Explosion = { id: nextId++, pos, size };
      set((state) => { const currentExplosions = state.explosions.filter(s => s.pos.distanceTo(pos) < 1 && s.size === size); return currentExplosions.length >= 2 ? state : {explosions: [...state.explosions, explosion]} });
    },
    removeExplosion: (id: number) => {
      removalQueue.push(id); // Add the explosion ID to the removal queue

      // If there's no pending timeout, set one to process the queue after a delay
      if (!removalTimeout) {
        removalTimeout = window.setTimeout(processRemovalQueue, 100); // 100ms delay, adjust as needed
      }
    }
  };
};

export default useEffects;