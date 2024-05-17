import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ObjectLocation } from "../../store/UseOriginDestination";
import { ObjectType } from "../../store/StoreState";
import useStore from "../../store/UseStore";
import RocketBooster from "../tools/RocketBooster";
import UseSoundEffect from "../../hooks/SoundEffect";
import { findAndClonePosition } from "../../util";

interface Props {
  missile: THREE.Group<THREE.Object3DEventMap>;
  posX: number;
  target:
    | { objectLocation: ObjectLocation; objectType: ObjectType }
    | undefined;
  fire: boolean;
  o: THREE.Vector3;
}

export const MissileLauncher = ({
  missile,
  posX,
  target,
  fire = false,
  o,
}: Props) => {
  const missileRef = useRef<THREE.Mesh>(null);
  const setExplosions = useStore((state) => state.setExplosions);
  const [stop, setStop] = useState(true);
  const dPos = new THREE.Vector3(posX, -1, 1);
  const { scene, camera } = useThree();
  const { sound: explosionSound, calculateVolume: calculateExplosionSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/missile-launch.mp3",
      scene: scene,
      minVolume: 0.75,
      camera: camera,
    });
  const distance = target?.objectLocation
    ? target.objectType === "Ship"
      ? o.distanceTo(target?.objectLocation.meshRef?.position)
      : o.distanceTo(target.objectLocation.position)
    : 100;
  useEffect(() => {
    if(stop) setTimeout(() => setStop(false), 1000);
  }, [target, stop]);
  useEffect(() => {
    if (fire) {
      explosionSound?.stop();
      explosionSound?.play();
    }
  }, [fire]);
  const setTheExplosion = () => {
    if (!missileRef.current) return;
    const thePos = new THREE.Vector3(0, 0, 0);
    thePos.x += posX * 1.5;
    thePos.z += 1;
    if (
      (target?.objectType === "Ship" &&
        target?.objectLocation.meshRef.position) ||
      (target?.objectType === "Construction" && target?.objectLocation.position)
    )
      setExplosions(
        target.objectType === "Ship"
          ? findAndClonePosition(target.objectLocation.meshRef)
              .clone()
              .add(thePos)
          : findAndClonePosition(target).clone().add(thePos),
        target.objectType === "Construction" ? "Medium" : "Small"
      );
  };
  missile.rotation.x = 1.55;
  useFrame(() => {
    if (!fire || stop) return;
    const mr = missileRef.current;
    if (mr) {
      mr.position.z += 0.2;
      if (mr.position.z >= distance) {
        mr.position.set(dPos.x, dPos.y, dPos.z)
        setTheExplosion();
        setStop(true);
      }
    }
  });

  return (
    <mesh position={dPos.clone()} ref={missileRef}>
      <primitive object={missile} />
      {fire && !stop && (
        <RocketBooster isHarvesting position={new THREE.Vector3(0, 0, 0)} />
      )}
    </mesh>
  );
};
