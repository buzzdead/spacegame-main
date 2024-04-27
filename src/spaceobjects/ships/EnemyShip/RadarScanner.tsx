import { useEffect, useRef, useState } from "react"
import useStore from "../../../store/useStore"
import { useThree } from "@react-three/fiber";
import { Vector3 } from 'three'
import { EffectComposer } from "@react-three/postprocessing";
import  {ShockWaveEffect} from 'postprocessing'
import ShockWaveComponent from "../../test/test";
import { SWave } from "./swave";

interface Props {
    setNearbyEnemies: (n: Vector3[]) => void
    origin: Vector3
}

export const RadarScanner = ({setNearbyEnemies, origin}: Props) => {
    const [hasNearby, setHasNearby] = useState(false)
    const ships = useStore(state => state.ships)
    const [scan, setScan] = useState(false)
    const groupRef = useRef<any>(null)

    useEffect(() => {
        const checkForNearByShips = () => {
        const nearby = ships.filter(e => e.meshRef?.position?.distanceTo(origin) <= 50).map(e => e.meshRef.position)
        setNearbyEnemies(nearby)
        setHasNearby(nearby.length > 0)
        }
        checkForNearByShips()
        setTimeout(() => setScan(!scan), 1500)
    }, [scan])
    
    return (<group ref={groupRef}>{hasNearby && <EffectComposer><SWave pos={origin} scan={scan}/></EffectComposer>}</group>)

}