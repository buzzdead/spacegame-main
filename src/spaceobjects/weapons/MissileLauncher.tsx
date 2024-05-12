import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from '@react-three/fiber'
import { ObjectLocation } from "../../store/UseOriginDestination";
import { ObjectType } from "../../store/StoreState";
import useStore from "../../store/UseStore";

interface Props {
  missile: THREE.Group<THREE.Object3DEventMap>;
  posX: number;
  target: {objectLocation: ObjectLocation, objectType: ObjectType} | undefined
  fire: boolean
  o: THREE.Vector3
}

export const MissileLauncher = ({ missile, posX, target, fire = false, o }: Props) => {
    const missileRef = useRef<THREE.Mesh>(null)
    const setExplosions = useStore((state) => state.setExplosions)
    const stopRef = useRef(false)
    useEffect(() => {
      stopRef.current = false
    }, [target])
    const setTheExplosion = () => {
      if(!missileRef.current) return
      const thePos = new THREE.Vector3(0,0,0)
      thePos.x += posX * 1.5
      thePos.z += 1
      const currentPos = missileRef.current.position.clone()
      if(target?.objectLocation.meshRef.position)
      setExplosions(target.objectLocation.meshRef.position.clone().add(thePos), "Small")
    }
    missile.rotation.x = 1.55
    useFrame(() => {
        
        if(!fire || stopRef.current) return
        const mr = missileRef.current
        if(mr) {
            mr.position.z += 0.5
            if(mr.position.z > 50) {
                missile.scale.set(0,0,0)
                setTheExplosion()
                stopRef.current = true
            }
        }
    })
  return (
    <mesh position={new THREE.Vector3(posX, -1, 1)} ref={missileRef}>
      <primitive object={missile} />
    </mesh>
  );
};
