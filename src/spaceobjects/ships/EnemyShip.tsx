import React, { useState } from "react";
import { SGS } from "../../store/useStore";
import Ship from "./Ship";
import { Mesh, MeshStandardMaterial } from 'three'
import { useAsset } from "../useAsset";
import { Explosion } from "./Explosion";
import { useTexture } from "@react-three/drei";

export const EnemyShip = () => {
    const scene = useAsset('/assets/spaceships/cruiser.glb', 1);
    const texture = useTexture("/assets/fire.jpg");
    const meshes: Mesh[] = scene.children as Mesh[];
    const [destroyed, setDestroyed] = useState(false)
    scene.position.set(155, 0, 155)
    scene.scale.set(0.1, 0.1, 0.1)
/*   for (let i = 0; i < meshes.length; i++) {
    console.log("meshes")
    const newMaterial = meshes[i].material as MeshStandardMaterial;
    newMaterial.color.set((ship.assetId === "fighter" || ship.assetId === "hawk") ? "darkorange" : "orange"); // Green
   
    meshes[i].material = newMaterial;} */
    const destroyShip = () => {
        setDestroyed(true)
        setTimeout(() => setDestroyed(false), 10000)
    }

       {return destroyed ? <Explosion position={scene.position.clone()} /> : <primitive onClick={destroyShip} object={scene} />}
    
}