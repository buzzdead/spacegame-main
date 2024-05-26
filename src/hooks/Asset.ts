import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import {Mesh, MeshStandardMaterial} from 'three'

export const useAsset = (glbPath: string, scale: number, noClone = false) => {
    const { scene } = useGLTF(glbPath, true, true)
    scene.scale.set(scale, scale, scale)
    if(glbPath.includes("fighter")) {
        scene.traverse((child) => {
            const c = child as Mesh
            //@ts-ignore
            if(c){

                c.material = new MeshStandardMaterial({
                    metalness: 0.35,  // Adjust based on your requirements
                    roughness: 0.35,  // Adjust based on your requirements
                    //@ts-ignore
                    map: child.material?.map, // Use the existing texture if any
                  });
                  
            }
        })
    }
    return noClone ? scene : scene.clone()
}