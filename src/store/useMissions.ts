import { StateCreator } from "zustand";
import SpaceGameStateUtils from "./SpaceGameStateUtils";
import { MissionState } from "./StoreState";

const useMissions: StateCreator<
    MissionState,
    [],
    [],
    MissionState
> = (set) => ({
    missions: [
        { name: "mission1", completed: false }
    ],
    setMissionComplete: (name: string) => set((state) => 
        { return { missions: state.missions.map(s => s.name === name ? { name: name, completed: true } : s) } })
})


export default useMissions;