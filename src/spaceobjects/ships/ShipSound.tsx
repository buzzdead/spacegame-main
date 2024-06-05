import { useEffect } from 'react';
import UseSoundEffect from "../../hooks/SoundEffect";

interface Props {
  isHarvesting: boolean;
  isTraveling: boolean;
  isReturning: boolean;
  meshRef: any
}

const ShipSound: React.FC<Props> = ({ isHarvesting, isTraveling, isReturning, meshRef }) => {
    const { sound: miningSound, calculateVolume: calculateMiningSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/mining.mp3",
      minVolume: 0.04,
    });
  const { sound: motorSound, calculateVolume: calculateMotorSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/sc.mp3",
      minVolume: 0.15,
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
      calculateMiningSound(meshRef.current.position);
      calculateMotorSound(meshRef.current.position);
    }
  }, [isTraveling, isReturning]);

  return null;
};

export default ShipSound;