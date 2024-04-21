import { useState, useEffect } from 'react';
import UseSoundEffect from "../../hooks/SoundEffect";
import { useThree } from "@react-three/fiber";

interface Props {
  isHarvesting: boolean;
  isTraveling: boolean;
  isReturning: boolean;
  meshRef: any
  calculateLaserSound: (d: number) => void
}

const ShipSound: React.FC<Props> = ({ isHarvesting, isTraveling, isReturning, meshRef, calculateLaserSound }) => {
    const { camera, scene } = useThree()
    const { sound: miningSound, calculateVolume: calculateMiningSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/mining.mp3",
      scene: scene,
      minVolume: 0.04,
      camera: camera,
    });
  const { sound: motorSound, calculateVolume: calculateMotorSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/sc.mp3",
      scene: scene,
      minVolume: 0.15,
      camera: camera,
    });

  useEffect(() => {
    if (isHarvesting) miningSound?.play();
    else miningSound?.stop();
  }, [isHarvesting]);

  useEffect(() => {
    if (isTraveling || isReturning) motorSound?.play();
    else motorSound?.pause();
  }, [isTraveling, isReturning]);

  useEffect(() => {
    if (meshRef.current && (isTraveling || isReturning)) {
      const distance = camera.position.distanceTo(meshRef.current.position);
      calculateMiningSound(distance);
      calculateMotorSound(distance);
      calculateLaserSound(distance)
    }
  }, [camera, isTraveling, isReturning]);

  return null; // This component doesn't render anything, it just handles sound effects
};

export default ShipSound;