import { ShockWave } from "@react-three/postprocessing"
import { useEffect, useRef, useState } from "react"
import {Vector3} from 'three'
import { BlendFunction, BlendMode } from 'postprocessing'
import { useThree, useFrame } from "@react-three/fiber";
interface Props {
    pos: Vector3
    scan?: boolean
}
export const SWave = ({pos, scan = false}: Props) => {
    const { camera, scene } = useThree()
    const explodeRef = useRef(false)
    const [exploding, setExploding] = useState(true)
    const shockWaveRef = useRef<any>(null)

    useFrame(() => {
        if(explodeRef.current) {shockWaveRef.current.explode(); explodeRef.current = false; setTimeout(() => explodeRef.current = true, 750)}
    })

    useEffect(() => {
        explodeRef.current = true
    }, [])


    return (
        //@ts-ignore
        <ShockWave
        id={pos.x}
        position={pos}
        coordinateSystem={2001}
        castShadow
        ref={shockWaveRef}
        speed={2.5}
        blendFunction={BlendFunction.NORMAL}
        blendMode={new BlendMode(BlendFunction.MULTIPLY)}
        opacity={0.5}
        maxRadius={15.0}
        waveSize={.2}
        amplitude={.05}
      /> as any
    )
   
}