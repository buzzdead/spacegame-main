import { useState } from "react";
import { Vector3, Quaternion } from 'three'
import useStore from "../../store/useStore";

interface Props {
  meshRef: any
}

const UseNavigation = ({meshRef}: Props) => {
    const setResources = useStore(state => state.setResources)
    const [isTraveling, setIsTraveling] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [shipsOrigin, setShipsOrigin] = useState<Vector3>();
    const [shipsDestination, setShipsDestination] = useState<Vector3>();

    const calculateDirectionAndRotation = (targetPosition: Vector3) => {
        if (!meshRef.current) return {};
        const direction = new Vector3()
          .subVectors(targetPosition, meshRef.current.position)
          .normalize();
    
        const targetQuaternion = new Quaternion().setFromUnitVectors(
          new Vector3(0, 0, 1), // Assuming front of your ship is along +Z
          direction
        );
    
        return { direction, targetQuaternion };
      };
      const updateShipPosition = (
        direction: Vector3,
        targetQuaternion: Quaternion,
        targetPosition: Vector3
      ) => {
        //if (!meshRef.current) return;
        const distance = 123
        //const distance = meshRef.current.position.distanceTo(targetPosition);
    
        if (distance < (isReturning ? 12 : 7)) {
          if (isTraveling) {
            setIsTraveling(false);
            setIsHarvesting(true);
            setTimeout(() => {
              setIsReturning(true);
              setIsHarvesting(false);
            }, 5000);
          } else if (isReturning) {
            setIsReturning(false);
            setTimeout(() => {
              setIsTraveling(true);
              setResources(500);
            }, 3000);
          }
    
          // Reset position to new target
        }
    
        const speedFactor = Math.max(5); // Adjust for sensitivity
        meshRef.current.position.add(
          direction.multiplyScalar((55 * speedFactor) / 5000)
        );
    
        meshRef.current.quaternion.slerp(targetQuaternion, 0.1);
      };
}