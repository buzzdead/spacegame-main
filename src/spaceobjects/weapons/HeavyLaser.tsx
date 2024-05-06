import {  useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import useStore from '../../store/UseStore';

interface Props {
  color: THREE.Color;
  origin: THREE.Vector3
  target: THREE.Vector3;
}

const HeavyLaser = ({ color, target, origin}: Props) => {
  const dealDamageToEnemy = useStore(state => state.dealDamageToEnemy)
  const [hit, setHit] = useState(false)
  const { scene } = useThree()
  const lastKnownTarget = useRef<any>()
  const laserRef = useRef<THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>>(null);
  const laserGeometry = new THREE.BoxGeometry(0.08, 0.08, 2);
  const laserMaterial = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 1,
  });


  useFrame(() => {
    if (laserRef.current && (target || lastKnownTarget.current) && !hit) {
      if(target) lastKnownTarget.current = target.clone()
      const direction = new THREE.Vector3();
      direction.subVectors(origin, target || lastKnownTarget.current);
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
        if(laserRef.current.position.distanceTo(target || lastKnownTarget.current) < 4) laserRef.current.geometry.scale(0.94,0.94,0.94)
        if(laserRef.current.position.distanceTo(target || lastKnownTarget.current) < 1) {target && dealDamageToEnemy(target, 34, true); laserRef.current.removeFromParent(); scene.remove(laserRef.current); setHit(true)}
    }
  });

  return (
    <mesh  ref={laserRef} geometry={laserGeometry} material={laserMaterial} scale={[3, 3, 3]} />
  );
};

export default HeavyLaser;