import { useEffect, useRef, useState } from "react"
import useStore from "../../../store/UseStore"
import { Vector3 } from 'three'
import { EffectComposer } from "@react-three/postprocessing";
import { SWave } from "./swave";
import { useFrame } from "@react-three/fiber";
import { ObjectLocation } from "../../../store/UseOriginDestination";

interface Props {
    setNearbyEnemies: (n: ObjectLocation[]) => void
    origin: Vector3
    nearby: boolean
    currentPos: Vector3
}

export const RadarScanner = ({setNearbyEnemies, origin, nearby, currentPos }: Props) => {
    const [hasNearby, setHasNearby] = useState(false)
    const [hasNearby2, setHasNearby2] = useState(nearby)
    const ships = useStore(state => state.ships)
    const toggleNearby = useStore(state => state.toggleNearby)
    const [scan, setScan] = useState(false)
    const groupRef = useRef<any>(null)
    const timeoutRef = useRef(true)

    useEffect(() => {
        const checkForNearByShips = () => {
        const nearby = ships.filter(e => e.meshRef?.position && e.meshRef?.position?.distanceTo(currentPos) <= 100)
        const nearby2 = ships.filter(e => e.meshRef?.position && e.meshRef?.position?.distanceTo(currentPos) <= 75)
        const isNear = nearby2.length > 0
        toggleNearby(currentPos, isNear)
        setNearbyEnemies(nearby)
        setHasNearby2(nearby2.length > 0)
        setHasNearby(nearby.length > 0)
        }
        checkForNearByShips()
        setTimeout(() => setScan(!scan), 1200)
    }, [scan])
    return null
    return (<group ref={groupRef}>{hasNearby && <EffectComposer><SWave pos={origin} scan={scan}/></EffectComposer>}</group>)

}