import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from '@react-three/fiber'
import { ObjectLocation } from "../../store/UseOriginDestination";
import { ObjectType } from "../../store/StoreState";

interface Props {
  missile: THREE.Group<THREE.Object3DEventMap>;
  posX: number;
  target: {objectLocation: ObjectLocation, objectType: ObjectType} | undefined
  fire: boolean
}

export const MissileLauncher = ({ missile, posX, target, fire = false }: Props) => {
    const missileRef = useRef<THREE.Mesh>(null)
    missile.rotation.x = 1.55
   /*  useFrame(() => {
        
        if(!fire) return
        const mr = missileRef.current
        if(mr) {
            mr.position.z += 0.5
            if(mr.position.z > 50) {
                missile.scale.set(0,0,0)
            }
        }
    }) */
  return (
    <mesh position={new THREE.Vector3(posX, -1, 1)} ref={missileRef}>
      <primitive object={missile} />
    </mesh>
  );
};
