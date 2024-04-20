import { useState } from "react"
import UseSoundEffect from "../../hooks/SoundEffect"
import Laser from "../weapons/Laser"
import { Vector3 } from 'three'
import { useThree } from "@react-three/fiber";

interface Props {
    position: Vector3
    fire: boolean
    target: Vector3
}

export const LaserCannon = ({fire, position, target}: Props) => {
    return (
        <group>
        <Laser
          fire={fire}
          origin={position}
          target={new Vector3(0, 0, 0)}
        />
        <Laser
          fire={fire}
          second
          origin={position}
          target={new Vector3(0, 0, 0)}
        />
      </group>
    )
}

export const useLaser = () => {
  const {camera, scene} = useThree()
    const [fire, setFire] = useState(false);
    const { sound: laserSound, calculateVolume: calculateLaserSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/laser.mp3",
      scene: scene,
      minVolume: 0.05,
      camera: camera,
    });
    const fireLaser = () => {
        setFire(!fire);
        laserSound?.stop();
        laserSound?.play();
      };
    return { calculateLaserSound, fireLaser, fire}
}