import { useEffect, useState } from "react"
import UseSoundEffect from "../../hooks/SoundEffect"
import Laser from "./Laser"
import { Vector3 } from 'three'
import { useThree } from "@react-three/fiber";

interface Props {
    position: Vector3
    fire: boolean
    target: {pos: Vector3, objectType: "Ship" | "Construction"}
    setFightDone: () => void
    color?: string
}

export const LaserCannon = ({fire, position, target, color = 'red', setFightDone}: Props) => {
  const { scene, camera } = useThree()
  const { sound: laserSound, calculateVolume: calculateLaserSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/laser.mp3",
    scene: scene,
    minVolume: 0.15,
    camera: camera,
  });
  useEffect(() => {
    const distance = camera.position.distanceTo(position)
    calculateLaserSound(distance)
  }, [camera, calculateLaserSound])
    return (
        <group>
        <Laser
          color={color}
          setFightDone={setFightDone}
          laserSound={laserSound}
          fire={fire}
          origin={position}
          target={target}
        />
        <Laser
          color={color}
          setFightDone={setFightDone}
          laserSound={laserSound}
          fire={fire}
          second
          origin={position}
          target={target}
        />
      </group>
    )
}

export const useLaser = () => {
    const [fire, setFire] = useState(false);
    const fireLaser = () => {
        setFire(!fire);
      };
    return { fireLaser, fire}
}