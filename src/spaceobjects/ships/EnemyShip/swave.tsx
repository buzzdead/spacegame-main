import { ShockWave, EffectComposer } from "@react-three/postprocessing"
import { useEffect, useRef } from "react"
import {Vector3} from 'three'
import { BlendFunction, BlendMode, Effect, ShockWaveEffect } from 'postprocessing'
import { useThree } from "@react-three/fiber";
import { vertexShader } from "three-nebula/src/renderer/GPURenderer/Desktop/shaders/vertexShader";
import { time } from "console";
interface Props {
    pos: Vector3
    scan: boolean
}
export const SWave = ({pos, scan}: Props) => {
    const { camera, scene } = useThree()
    const shockWaveRef = useRef<any>(null)
    useEffect(() => {
        shockWaveRef.current.epicenter = new Vector3(pos.x, pos.y, pos.z)
        shockWaveRef.current.explode()
    }, [scan])
    return (
        //@ts-ignore
        <ShockWave
        position={pos}
        id={pos.x}
        epicenter={pos}
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