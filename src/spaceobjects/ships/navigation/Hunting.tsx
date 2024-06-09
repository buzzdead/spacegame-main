import { useFrame } from "@react-three/fiber";
import { HuntingNavigation } from "./types";
import { MathUtils, Quaternion, Vector3 } from "three";
import { easing } from "maath";
import useStore from "../../../store/UseStore";
import { useRef } from "react";
import { Ignition } from "../../tools/Ignition";

export const Hunting = ({ ...p }: HuntingNavigation) => {
  const goToNextStage = useStore(state => state.goToNextStage)
  const finished = useRef(false)

  const getShift = (targetPosition: Vector3) => {
    if(!p.group?.id) return 0
    const distance = p.meshRef.current.position.distanceTo(targetPosition);
    const shipShift = p.meshRef.current.shipShift;
    const shiftToLeft = (p.group?.id % 2 === 1)
    const shiftAngleRadians = MathUtils.degToRad(10 * (p.group.id - (shiftToLeft ? 0 : 1)));
    const rotationAxis = new Vector3(0, 1, 0);
    const shiftQuaternion = new Quaternion().setFromAxisAngle(
      rotationAxis,
      shiftToLeft ? shiftAngleRadians : -shiftAngleRadians
    );
    return shiftQuaternion;
  };

  useFrame((state, delta) => {
    if (!p.meshRef) return;
    if(p.target.current){
      const dst = p.target.current.meshRef.position.distanceTo(p.meshRef.current.position)
    if(dst < 70) return

    const direction = new Vector3()

    .subVectors(p.target.current.meshRef.position.clone(), p.meshRef.current.position.clone())
    .normalize();
    if(dst > 100) {
      const shift = getShift(p.target.current.meshRef.position)
      if(shift) direction.applyQuaternion(shift)
    }
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
    {
      if(p.meshRef.current.position.z < -1000) { finished.current = true; goToNextStage("mission1") }
      p.meshRef.current.position.z -= 0.5;
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

  return p.nearby.current ? null : <Ignition type="cruiser" />
};
