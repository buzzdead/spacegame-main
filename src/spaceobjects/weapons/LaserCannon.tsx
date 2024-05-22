import { ElementRef, useEffect, useRef, useState } from "react"
import UseSoundEffect from "../../hooks/SoundEffect"
import Laser from "./Laser"
import { Vector3 } from 'three'
import { useGLTF } from "@react-three/drei";
import { ObjectType } from "../../store/StoreState";
import { ObjectLocation } from "../../store/UseOriginDestination";
import { weapons } from "../../store/StoreAssets";
import { MissileLauncher } from "./MissileLauncher";

interface Props {
    position: Vector3
    fire: boolean
    target: {objectLocation: ObjectLocation, objectType: ObjectType} | undefined
    setFightDone: () => void
    color?: string
}

export const LaserCannon = ({fire, position, target, color = 'red', setFightDone}: Props) => {
  const missilePath = weapons.find(e => e.id === "fighter-missile")?.glbPath
  const {scene: missileScene} = useGLTF(missilePath || "")
  const meshRef = useRef<ElementRef<"group">>(null)
  missileScene.scale.set(0.75,0.75,0.75)

  const { sound: laserSound, calculateVolume: calculateLaserSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/laser.mp3",
    minVolume: 0.15,
  });
  const { sound: missileSound, calculateVolume: calculateMissileSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/missile-launch.mp3",
    minVolume: 0.75,
  });
  useEffect(() => {
    calculateLaserSound(position)
    calculateMissileSound(position)
  }, [calculateLaserSound])
    return (
        <group ref={meshRef}>
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
        <MissileLauncher setFightDone={setFightDone} sound={missileSound} meshRef={meshRef} fire={fire} target={target} posX={3} missile={missileScene.clone()}/>
        <MissileLauncher setFightDone={setFightDone} sound={missileSound} meshRef={meshRef} fire={fire} target={target} posX={-3} missile={missileScene.clone()}/>
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