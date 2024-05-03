import { useEffect, useRef, useState } from "react"
import useStore from "../../../store/UseStore"
import { useThree } from "@react-three/fiber";
import { Vector3 } from 'three'
import { EffectComposer } from "@react-three/postprocessing";
import  {ShockWaveEffect} from 'postprocessing'
import ShockWaveComponent from "../../../features/Shockwave";
import { SWave } from "./swave";

interface Props {
    setNearbyEnemies: (n: Vector3[]) => void
    origin: Vector3
    nearby: boolean
}

export const RadarScanner = ({setNearbyEnemies, origin, nearby}: Props) => {
    const [hasNearby, setHasNearby] = useState(false)
    const [hasNearby2, setHasNearby2] = useState(nearby)
    const ships = useStore(state => state.ships)
    const toggleNearby = useStore(state => state.toggleNearby)
    const [scan, setScan] = useState(false)
    const groupRef = useRef<any>(null)

    useEffect(() => {
        const checkForNearByShips = () => {
        const nearby = ships.filter(e => e.meshRef?.position?.distanceTo(origin) <= 50).map(e => e.meshRef.position)
        const nearby2 = ships.filter(e => e.meshRef?.position?.distanceTo(origin) <= 75).map(e => e.meshRef.position)
        const isNear = nearby2.length > 0
        isNear !== hasNearby2 && toggleNearby(origin)
        setNearbyEnemies(nearby)
        setHasNearby2(nearby2.length > 0)
        setHasNearby(nearby.length > 0)
        }
        checkForNearByShips()
        setTimeout(() => setScan(!scan), 1500)
    }, [scan])
    return null
    return (<group ref={groupRef}>{hasNearby && <EffectComposer><SWave pos={origin} scan={scan}/></EffectComposer>}</group>)

}