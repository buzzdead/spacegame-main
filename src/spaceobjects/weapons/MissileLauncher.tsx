import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ObjectLocation } from "../../store/UseOriginDestination";
import { ObjectType } from "../../store/StoreState";
import { useShallowStore } from "../../store/UseStore";
import RocketBooster from "../tools/RocketBooster";
import { getTargetPos } from "../../util";

interface Props {
  missile: THREE.Group<THREE.Object3DEventMap>;
  posX: number;
  target:
    | { objectLocation: ObjectLocation; objectType: ObjectType }
    | undefined;
  fire: boolean;
  meshRef?: any;
  sound: any;
  setFightDone: () => void;
}

export const MissileLauncher = ({
  missile,
  posX,
  target,
  fire = false,
  meshRef,
  sound,
  setFightDone,
}: Props) => {
  const explosionPos = new THREE.Vector3(0, 0, 0);
  const localPos = new THREE.Vector3(posX, -1, 1);
  explosionPos.x += posX * 1.5;
  explosionPos.z += 1;

  const missileRef = useRef<THREE.Mesh>(null);
  const { setExplosions, dealDamageToConstruction, dealDamageToEnemy } =
    useShallowStore([
      "dealDamageToConstruction",
      "dealDamageToEnemy",
      "setExplosions",
    ]);
  const [stop, setStop] = useState(true);

  const targetPos = getTargetPos(target)

  useEffect(() => {
    if (stop) setTimeout(() => setStop(false), 1000);
  }, [target, stop]);
  useEffect(() => {
    if (fire && !stop) {
      sound?.stop();
      sound?.play();
    }
  }, [fire, stop]);
  const setTheExplosion = () => {
    if (!missileRef.current || !target) return;
    if (targetPos)
      setExplosions(
        targetPos.clone().add(explosionPos),
        target.objectType === "Construction" ? "Medium" : "Small"
      );
  };
  missile.rotation.x = 1.55;
  useFrame(() => {
    if (!target || !fire || stop) return;
    const mr = missileRef.current;
    if (mr && meshRef.current) {
      const ltw = meshRef.current.worldToLocal(targetPos.clone());

      const direction = new THREE.Vector3()
        .subVectors(ltw.clone(), mr.position)
        .normalize();

      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), // Assuming front of your ship is along +Z
        direction
      );
      const dst = ltw.distanceTo(mr.position);
      if (dst > 20) {
        const abc = THREE.MathUtils.degToRad(dst > 30 ? 15 : 7.5);
        const rotationAxis = new THREE.Vector3(0, 1, 0);
        const shiftQuaternion = new THREE.Quaternion().setFromAxisAngle(
          rotationAxis,
          posX > 0 ? abc : -abc
        );
        direction.applyQuaternion(shiftQuaternion);
      }

      const speedFactor = 25;
      mr.position.add(direction.multiplyScalar((55 * speedFactor) / 5000));
      mr.quaternion.slerp(targetQuaternion, dst > 30 ? 1 : 0.4);

      if (ltw.distanceTo(mr.position) < 10) {
        mr.position.set(localPos.x, localPos.y, localPos.z);
        mr.rotation.set(0, 0, 0);
        setTheExplosion();
        const destroyed =
          target.objectType === "Ship"
            ? dealDamageToEnemy(target.objectLocation.id, 10)
            : dealDamageToConstruction(target.objectLocation.id, 10);
        if (destroyed === "Destroyed" || destroyed === "Not Found")
          setFightDone();
        setStop(true);
      }
    }
  });

  return (
    <mesh position={localPos.clone()} ref={missileRef}>
      <primitive object={missile} />
      {fire && !stop && (
        <RocketBooster
          type="smoke"
          isHarvesting
          position={new THREE.Vector3(0, 0, 0)}
        />
      )}
    </mesh>
  );
};
