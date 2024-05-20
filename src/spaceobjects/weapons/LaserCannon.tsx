import { ElementRef, useEffect, useMemo, useRef, useState } from "react"
import UseSoundEffect from "../../hooks/SoundEffect"
import Laser from "./Laser"
import { Vector3 } from 'three'
import { useThree } from "@react-three/fiber";
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
  const { scene, camera } = useThree()
  const missilePath = weapons.find(e => e.id === "fighter-missile")?.glbPath
  const {scene: missileScene} = useGLTF(missilePath || "")
  const rr = useRef<ElementRef<"group">>(null)

  useEffect(() => {
    missileScene.scale.set(0.75,0.75,0.75)
  })


  const { sound: laserSound, calculateVolume: calculateLaserSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/laser.mp3",
    scene: scene,
    minVolume: 0.15,
    camera: camera,
  });
  const { sound: missileSound, calculateVolume: calculateMissileSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/missile-launch.mp3",
    scene: scene,
    minVolume: 0.75,
    camera: camera,
  });
  useEffect(() => {
    const distance = camera.position.distanceTo(position)
    calculateLaserSound(distance)
    calculateMissileSound(distance)
  }, [camera, calculateLaserSound])
    return (
        <group ref={rr}>
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
        <MissileLauncher setFightDone={setFightDone} sound={missileSound} rr={rr} o={position} fire={fire} target={target} posX={3} missile={missileScene.clone()}/>
        <MissileLauncher setFightDone={setFightDone} sound={missileSound} rr={rr} o={position} fire={fire} target={target} posX={-3} missile={missileScene.clone()}/>
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