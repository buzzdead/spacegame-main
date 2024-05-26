import useStore from "../store/UseStore"
import { Environment, Stats, StatsGl } from "@react-three/drei";

export const StatsComponent = () => { 
    const stats = useStore(state => state.stats)

    return stats ? <StatsGl /> : null
}