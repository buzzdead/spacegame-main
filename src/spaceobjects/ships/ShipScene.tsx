import React from "react";
import { SGS } from "../../store/UseStore";
import Ship from "./Ship";
import { useAsset } from "../../hooks/Asset";

interface Props {
    ship: SGS["Ship"];
  }

export const ShipScene: React.FC<Props> = ({ship}) => {
    const { glbPath, position, scale } = ship;
    const scene = useAsset(glbPath, scale || 1);
  
  if(ship.assetId !== "cargo") scene.rotation.set(0, -1.55, 0);
  if (ship.assetId === "fighter") {
    
    scene.children[0].rotation.y = -55;
  }
  if(ship.assetId === "hawk" || ship.assetId === "hullspaceship") {
    scene.rotation.set(0, 3.11, 0)
  }
  console.log("s")
    return ( 
        <Ship scene={scene} ship={ship}/>
    )
    
}