import { SpaceShipId } from "../../../store/StoreAssets"
import { Quaternion, Vector3 } from 'three'
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

interface Props {
    shipType: SpaceShipId
    shipId: string
    meshRef: any
    origin: Vector3
    nearby: boolean
  }

  export const EnemyNavigation = ({shipType, shipId, meshRef, origin, nearby}: Props) => {
    const targetRef = origin.clone()
    const patrolDistance = 75;
    const patrolOffset = 125;
    const patrolPosition = [
        new Vector3(targetRef.x, targetRef.y, targetRef.z + patrolDistance),
        new Vector3(targetRef.x, targetRef.y, targetRef.z + patrolDistance * 2),
        new Vector3(targetRef.x + patrolOffset, targetRef.y, targetRef.z + patrolDistance * 2),
        new Vector3(targetRef.x + patrolOffset, targetRef.y, targetRef.z),
        targetRef
    ]
    const currentTarget = useRef(0)
    useFrame(() => {
        if(nearby) return
        const target = patrolPosition[currentTarget.current]
        if(target.distanceTo(meshRef.current.position) < 2) currentTarget.current = (currentTarget.current + 1) % patrolPosition.length
        const direction = new Vector3()
        .subVectors(target, meshRef.current.position)
        .normalize();
  
        const targetQuaternion = new Quaternion().setFromUnitVectors(
            new Vector3(0, 0, 1), // Assuming front of your ship is along +Z
            direction
        );
        const speedFactor = 15; // Adjust for sensitivity
        meshRef.current.position.add(
            direction.multiplyScalar((55 * speedFactor) / 5000)
        );
    
        meshRef.current.quaternion.slerp(targetQuaternion, 0.1);
        
    })
    return null
}