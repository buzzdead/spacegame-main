import { useEffect, useState } from "react";
import useStore from "../../store/useStore";
import {  Vector3 } from "three";
import { useThree } from "@react-three/fiber";
import { Explosion } from "./Explosion";
import { useTexture } from "@react-three/drei";
import UseSoundEffect from "../../hooks/SoundEffect";

interface Props {
  shipId: number
  eScene: any
  position: Vector3
}

export const EnemyShip = ({shipId, eScene, position}: Props) => {
  const setDestination = useStore((state) => state.setDestination);
  const setSelectedEnemies = useStore((state) => state.setSelectedEnemies);
  const selectedEnemies = useStore((state) => state.selectedEnemies)
  const { camera, scene } = useThree()
  const texture = useTexture.preload("/assets/fire.jpg");
  const [destroyed, setDestroyed] = useState(false);
  const { sound: explosionSound, calculateVolume: calculateExplosionSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/explo.mp3",
    scene: scene,
    minVolume: 0.75,
    camera: camera,
  });
  useEffect(() => {
    const distance = camera.position.distanceTo(eScene.position);
    calculateExplosionSound(distance)
  }, [camera])

  /*   for (let i = 0; i < meshes.length; i++) {
    console.log("meshes")
    const newMaterial = meshes[i].material as MeshStandardMaterial;
    newMaterial.color.set((ship.assetId === "fighter" || ship.assetId === "hawk") ? "darkorange" : "orange"); // Green
    
    meshes[i].material = newMaterial;} */
  const destroyShip = () => {
    console.log("what")
    setDestroyed(true);
    explosionSound?.play()
    setTimeout(() => {setDestroyed(false); setSelectedEnemies({ship: shipId, hull: 100})}, 10000)
  };
  const handleOnClick = () => {
    setDestination(position);
    setSelectedEnemies({ship: shipId, hull: 100});
  };

  useEffect(() => {
    console.log(selectedEnemies, shipId)
    if(selectedEnemies.ship === shipId && selectedEnemies?.hull <= 0) destroyShip()
  }, [selectedEnemies])

  {
    return destroyed ? (
      <Explosion position={position} />
    ) : (
      <primitive onClick={handleOnClick} object={eScene} />
    );
  }
};
