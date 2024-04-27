import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';

export const useAsset = (glbPath: string, scale: number) => {
    const { scene } = useGLTF(glbPath)
    scene.scale.set(scale, scale, scale)
    const clone = useMemo(() => scene.clone(), [scene])
    return clone
}