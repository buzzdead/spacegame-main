import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import useStore from "../../store/UseStore";

interface Props {
  color: THREE.Color;
  origin: THREE.Vector3;
  target: THREE.Vector3;
  shipRef: any;
}

const HeavyLaser = ({ color, target, origin, shipRef }: Props) => {
  const dealDamageToEnemy = useStore((state) => state.dealDamageToEnemy);
  const hit = useRef(false)
  const { scene } = useThree();
  const lastKnownTarget = useRef<any>();
  const laserRef =
    useRef<THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>>(null);
  const laserGeometry = new THREE.BoxGeometry(0.08, 0.08, 2);
  const pos = shipRef.current?.position || origin;
  //pos.x -= 7.5
  const laserMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 1,
  });

  useFrame(() => {
    if (laserRef.current && (target || lastKnownTarget.current) && !hit.current) {
      if (target) lastKnownTarget.current = target.clone();
      const direction = new THREE.Vector3();
      direction.subVectors(target || lastKnownTarget.current, origin);
      direction.normalize();
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1), // Assuming front of your ship is along +Z
        direction
      );
      const speedFactor = Math.max(25); // Adjust for sensitivity
      laserRef.current.position.add(
        direction.multiplyScalar((55 * speedFactor) / 5000)
      );

      laserRef.current.quaternion.slerp(targetQuaternion, 0.1);
      if (
        laserRef.current.position.distanceTo(
          target || lastKnownTarget.current
        ) < 10
      )
        laserRef.current.scale.multiply(new THREE.Vector3(0.95, 0.95, 0.95))
      if (
        laserRef.current.position.distanceTo(
          target || lastKnownTarget.current
        ) < 1
      ) {
        if(!target) return
        const report = dealDamageToEnemy(target, 34, true);
        laserRef.current.scale.set(0,0,0)
        hit.current = true
        if(report === "Destroyed" || report === "Not Found") return
        setTimeout(() => {
          if(!laserRef.current) return
          hit.current = false
          laserRef.current.scale.set(3,3,3)
          laserRef.current.position.set(pos.x, pos.y, pos.z);
        }, 500);
      }
    }
  });

  return (
    <mesh
      position={pos}
      ref={laserRef}
      geometry={laserGeometry}
      material={laserMaterial}
      scale={[3, 3, 3]}
    />
  );
};

export default HeavyLaser;
