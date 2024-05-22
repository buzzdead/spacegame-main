import { Vector3 } from 'three'

export const getTargetPos = (target: any) => {
  const targetPos = target ? target.objectType === "Ship"
  ? target.objectLocation.meshRef?.position
  : target.objectType === "Construction"
  ? target.objectLocation.position
  : null : null;

  return targetPos
}