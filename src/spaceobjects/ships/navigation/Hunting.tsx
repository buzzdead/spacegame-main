import { useFrame } from "@react-three/fiber";
import { HuntingNavigation } from "./types";
import { Ignition } from "../../tools/Ignition";
import { Quaternion, Vector3 } from "three";
import { easing } from "maath";

export const Hunting = ({ ...p }: HuntingNavigation) => {
  useFrame((state, delta) => {
    if (!p.meshRef) return;
    if(p.target.current){
    if(p.target.current.meshRef.position.distanceTo(p.meshRef.current.position) < 70) return
    const direction = new Vector3()
    .subVectors(p.target.current.meshRef.position.clone(), p.meshRef.current.position.clone())
    .normalize();
    const targetQuaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1), // Assuming front of your ship is along +Z
      direction
    );
    const speedFactor = 25
    p.meshRef.current.position.add(
      direction.multiplyScalar((55 * speedFactor) / 5000)
    );
    p.meshRef.current.quaternion.slerp(targetQuaternion, 0.5);
  
  }
  else
    {p.meshRef.current.position.z -= 0.5;
    easing.damp(
      p.meshRef.current.rotation,
      'y', // key for the rotation axis
      3.1, // target value
      0.1, // damping factor
      delta // delta time
    );
    easing.damp(
      p.meshRef.current.rotation,
      'x', // key for the rotation axis
      0, // target value
      0.1, // damping factor
      delta // delta time
    );
    easing.damp(
      p.meshRef.current.rotation,
      'z', // key for the rotation axis
      0, // target value
      0.1, // damping factor
      delta // delta time
    );}
  });

  return null
};
