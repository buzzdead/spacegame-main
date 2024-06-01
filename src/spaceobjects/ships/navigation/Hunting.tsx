import { useFrame } from "@react-three/fiber";
import { HuntingNavigation } from "./types";
import { Ignition } from "../../tools/Ignition";
import { Quaternion, Vector3 } from "three";

export const Hunting = ({ ...p }: HuntingNavigation) => {
  useFrame(() => {
    if (!p.meshRef) return;
    if(p.target.current){
    if(p.target.current.position.distanceTo(p.meshRef.current.position) < 50) {
      return
    }
    const direction = new Vector3()
    .subVectors(p.target.current.position.clone(), p.meshRef.current.position.clone())
    .normalize();
    const targetQuaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, -1), // Assuming front of your ship is along +Z
      direction
    );
    const speedFactor = 25
    p.meshRef.current.position.add(
      direction.multiplyScalar((55 * speedFactor) / 5000)
    );
    p.meshRef.current.quaternion.slerp(targetQuaternion, 0.5);
  
  }
  else
    p.meshRef.current.position.z -= 0.1;
  });

  return <Ignition type={"cruiser"} />
};
