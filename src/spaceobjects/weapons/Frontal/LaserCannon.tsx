import { ElementRef, useEffect, useRef, useState } from "react"
import UseSoundEffect from "../../../hooks/SoundEffect"
import { Vector3 } from 'three'
import { useGLTF } from "@react-three/drei";
import { ObjectType } from "../../../store/StoreState";
import { ObjectLocation } from "../../../store/storeSlices/UseOriginDestination";
import { SpaceShipId, weapons } from "../../../store/StoreAssets";
import { MissileLauncher } from "../MissileLauncher";
import { useThree } from '@react-three/fiber'
import FrontalMountedWeapon from "./FrontalMountedWeapon";

interface Props {
    position: Vector3
    fire: boolean
    target: {objectLocation: ObjectLocation, objectType: ObjectType} | undefined
    setFightDone: () => void
    whatever: any
    shipType: SpaceShipId
}

export const LaserCannon = ({fire, position, target, setFightDone, whatever, shipType}: Props) => {
  const missilePath = weapons.find(e => e.id === "fighter-missile")?.glbPath
  const { camera } = useThree()
  const {scene: missileScene} = useGLTF(missilePath || "")
  
  //@ts-ignore
  const mat = missileScene.children[0].material
  mat.emissiveIntensity = 0.1
  mat.metalness = 0.5
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
    minVolume: 0.25,
  });
  const { sound: plasmaSound, calculateVolume: calculatePlasmaSound } =
  UseSoundEffect({
    sfxPath: "/assets/sounds/experimental/plasma-beam2.mp3",
    minVolume: 0.25,
  });
  useEffect(() => {
    if(whatever) {
      const newPos = whatever.current.position
      calculateLaserSound(newPos)
      calculatePlasmaSound(newPos)
    calculateMissileSound(newPos)
    }
    else{
    calculateLaserSound(position)
    calculatePlasmaSound(position)
    calculateMissileSound(position)}
  }, [position, fire, camera.position])
    return (
        <group ref={meshRef}>
        <FrontalMountedWeapon
        weaponType={shipType === "fighter" ? "laser" : "plasma"}
        mountPosition="left"
          color={shipType === "fighter" ? 'red' : '#ff0a0a'}
          setFightDone={setFightDone}
          sound={shipType === "fighter" ? laserSound : plasmaSound}
          fire={fire}
          origin={position}
          target={target}
        />
        <FrontalMountedWeapon
        weaponType={shipType === "fighter" ? "laser" : "plasma"}
        mountPosition="right"
          color={shipType === "fighter" ? 'red' : '#ff0a0a'}
          setFightDone={setFightDone}
          sound={shipType === "fighter" ? laserSound : plasmaSound}
          fire={fire}
          origin={position}
          target={target}
        />
        {shipType === "fighter" && <MissileLauncher setFightDone={setFightDone} sound={missileSound} meshRef={meshRef} fire={fire} target={target} posX={3} missile={missileScene.clone()}/> }
        {shipType === "fighter" && <MissileLauncher setFightDone={setFightDone} sound={missileSound} meshRef={meshRef} fire={fire} target={target} posX={-3} missile={missileScene.clone()}/> }
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