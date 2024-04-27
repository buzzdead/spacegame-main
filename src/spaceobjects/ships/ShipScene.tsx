import React from "react";
import { SGS } from "../../store/useStore";
import Ship from "./Ship";
import { Mesh, MeshStandardMaterial } from 'three'
import { useAsset } from "../../hooks/useAsset";

interface Props {
    ship: SGS["Ship"];
  }

export const ShipScene: React.FC<Props> = ({ship}) => {
    const { glbPath, position, scale } = ship;
    const scene = useAsset(glbPath, scale || 1);
    const meshes: Mesh[] = scene.children as Mesh[];
/*   for (let i = 0; i < meshes.length; i++) {
    console.log("meshes")
    const newMaterial = meshes[i].material as MeshStandardMaterial;
    newMaterial.color.set((ship.assetId === "fighter" || ship.assetId === "hawk") ? "darkorange" : "orange"); // Green
   
    meshes[i].material = newMaterial;} */
  
  scene.rotation.set(0, -1.55, 0);
  if (ship.assetId === "fighter") {
    
    scene.children[0].rotation.y = -55;
  }
  if(ship.assetId === "hawk") {
    scene.rotation.set(0, 3.11, 0)
  }
    return ( 
        <Ship scene={scene} ship={ship}/>
    )
    
}