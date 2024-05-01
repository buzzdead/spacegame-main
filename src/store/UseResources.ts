import { StateCreator } from "zustand";
import { ResourceState } from "./StoreState";

const useResources: StateCreator<
  ResourceState,
  [],
  [],
  ResourceState
> = (set) => ({
  resources: 10500,
  setResources: (n: number) => {
    let a = false;
    set((state) => {
      const newResources = state.resources + n;
      const success = newResources >= 0;
      a = success;
      return { resources: success ? newResources : state.resources };
    });
    return a;
  },
})

export default useResources;