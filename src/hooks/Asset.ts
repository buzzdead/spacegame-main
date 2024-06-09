import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import {Mesh, MeshStandardMaterial} from 'three'

export const useAsset = (glbPath: string, scale: number, noClone = false) => {
    const { scene } = useGLTF(glbPath, true, true)
    scene.scale.set(scale, scale, scale)
   
    return noClone ? scene : scene.clone()
}