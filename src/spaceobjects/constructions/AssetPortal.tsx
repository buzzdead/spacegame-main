import { useState } from "react";
import { useShallowStore } from "../../store/UseStore";
import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber";
import UseSoundEffect from "../../hooks/SoundEffect";

interface Props {
    assetPosition: THREE.Vector3
    x: number
}

export const AssetPortal = ({assetPosition, x}: Props) => {
  const [clicked, setClicked] = useState(false);
  const {scene, camera} = useThree()
  const { ships, addShip, setResources } = useShallowStore([
    "addShip",
    "ships",
    "setResources",
  ]);
  const { sound: fighterSound, calculateVolume: calculateFighterSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/fighter.mp3",
    scene: scene,
    minVolume: 15,
    camera: camera,
  });
  const auraGeometry = new THREE.SphereGeometry(3, 32, 32);
  const auraMaterial = new THREE.MeshPhongMaterial({
    color: "green",
    opacity: 0.0001,
    transparent: true,
    emissive: "white", // Add this line to make the material glow
    emissiveIntensity: 45.5, // Adjust this value to control the glow intensity
  });
  const auraMesh = new THREE.Mesh(auraGeometry, auraMaterial);
  auraMesh.position.copy(assetPosition);
  auraMesh.scale.setScalar(1.2); // adjust the scale to fit your needs

  useFrame(() => {
    if(clicked) {auraMesh.material.emissiveIntensity += 50}
  })

  const handleOnClick = (e: any) => {
    e.stopPropagation();
    const a = setResources(x ? -5000 : -1500);
    if (!a) return;
    fighterSound?.stop()
    fighterSound?.play()
    setClicked(true);
    addShip(
      x ? "hawk" : "fighter",
      [-30 + (ships.length * 25), 0, -45],
      100,
      x ? 0.03 : 20
    );
    setTimeout(() => setClicked(false), 150);
  };

  return (
        <primitive onClick={handleOnClick} object={auraMesh} />
  )
};
