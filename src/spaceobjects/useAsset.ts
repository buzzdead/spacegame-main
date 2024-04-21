import { useGLTF } from '@react-three/drei';

export const useAsset = (glbPath: string, scale: number) => {
    const { scene } = useGLTF(glbPath)
    scene.scale.set(scale, scale, scale)
    return scene.clone()
}