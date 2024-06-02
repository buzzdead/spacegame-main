import { useEffect } from "react"
import useStore from "../../../store/UseStore"

interface Props {
    toggleType: () => void
}

export const NavigationSwitcher = ({toggleType}: Props) => {
    const missions = useStore(state => state.missions)
    useEffect(
        () => {

            const mission = missions.find(m => m.name === "mission1")
            if(!mission) return
            if(mission.currentStage === "stage2") {
                toggleType()
            }
        }
    , [missions])
    return null
}