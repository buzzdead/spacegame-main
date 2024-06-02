import { StateCreator } from "zustand";
import SpaceGameStateUtils from "../SpaceGameStateUtils";
import { MissionState } from "../StoreState";

const useMissions: StateCreator<
    MissionState,
    [],
    [],
    MissionState
> = (set) => ({
    missions: [
        { name: "mission1", stages: ["stage1", "stage2", "stage3"], currentStage: "stage1", completed: false }
    ],
    goToNextStage: (name: string) => set((state) => {
        const mission = state.missions.find(s => s.name === name)
        if (!mission) return state
        const id = mission.stages.indexOf(mission.currentStage)
        if (id === mission.stages.length - 1) return { missions: state.missions.map(m => m.name === name ? { ...mission, completed: true } : m) }
        else return { missions: state.missions.map(m => m.name === name ? { ...mission, currentStage: mission.stages[id + 1] } : m) }
        return state
    })
})


export default useMissions;