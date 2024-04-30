import { useEffect, useState } from "react";
import { Vector3, Quaternion } from 'three'
import { useShallowStore } from "../../store/useStore";
import { SpaceShipId } from "../../store/storeAssets";

interface Props {
  shipType: SpaceShipId
  shipId: string
  meshRef: any
}

const UseNavigation = ({shipId, meshRef, shipType}: Props) => {
    const { destination, setResources, origin, selected, setSelected} = useShallowStore(["destination", "setResources", "origin", "selected", "setSelected"])
    const [isTraveling, setIsTraveling] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const [isFighting, setIsFighting] = useState(false)
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [shipsOrigin, setShipsOrigin] = useState<Vector3>();
    const [shipsDestination, setShipsDestination] = useState<Vector3>();
    const isFighter = (shipType === "fighter" || shipType === "hawk")

    useEffect(() => {
      if (!selected.find((s) => s.id === shipId)) return;
      if (destination && destination.pos !== shipsDestination) {
        if(isFighting) setIsFighting(false)
        setShipsDestination(destination.pos);
      }
      if (origin && origin !== shipsOrigin) {
        setShipsOrigin(origin);
      }
      if(isFighter) setShipsOrigin(meshRef.current.position)
    }, [destination, origin]);
  
    useEffect(() => {
      if (shipsOrigin && shipsDestination) {
        setIsTraveling(true);
        setSelected(shipId);
      }

    }, [shipsOrigin, shipsDestination]);

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
        targetPosition: Vector3,
      ) => {
        if (!meshRef.current) return;
        const distance = meshRef.current.position.distanceTo(targetPosition);
        const theAngle = targetQuaternion?.angleTo(meshRef.current.quaternion)
    
        if (distance < (isReturning ? 12 : isFighter ? 50 : 12) && theAngle < 0.05) {
          if (isTraveling) {
            if(isFighter)
              { 
                setIsFighting(true)
                setIsTraveling(false)
              }
              else {
            setIsTraveling(false);
            setIsHarvesting(true);
            setTimeout(() => {
              setIsReturning(true);
              setIsHarvesting(false);
            }, 5000);
          }} else if (isReturning) {
            setIsReturning(false);
            setTimeout(() => {
              setIsTraveling(true);
              setResources(500);
            }, 3000);
          }
        }
    
        const speedFactor = Math.max(15); // Adjust for sensitivity
        meshRef.current.position.add(
          direction.multiplyScalar((55 * speedFactor) / 5000)
        );
    
        meshRef.current.quaternion.slerp(targetQuaternion, 0.1);
      };

      return { isHarvesting, isReturning, isTraveling, shipsOrigin, shipsDestination, calculateDirectionAndRotation, updateShipPosition, isFighting, setIsFighting }
}

export default UseNavigation