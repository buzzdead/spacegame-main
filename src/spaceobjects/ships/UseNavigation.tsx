import { useEffect, useMemo, useState } from "react";
import { Vector3, Quaternion } from 'three'
import { useShallowStore } from "../../store/UseStore";
import { SpaceShipId } from "../../store/StoreAssets";
import { useFrame } from "@react-three/fiber";
import ShipSound from "./ShipSound";
import * as THREE from 'three'
import { LaserCannon } from "../weapons/LaserCannon";
import { Ignition } from "../tools/Ignition";
import { HarvestLaser } from "../tools/HarvestLaser";
import { ObjectType } from "../../store/StoreState";
import { ObjectLocation } from "../../store/UseOriginDestination";

interface Props {
  shipType: SpaceShipId
  shipId: string
  meshRef: any
  isSelected: boolean
}

const Navigation = ({shipId, meshRef, shipType, isSelected}: Props) => {
    const { destination, setResources, origin, setShipRef, setSelected} = useShallowStore(["destination", "setResources", "origin", "setShipRef", "setSelected"])
    const [isTraveling, setIsTraveling] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const [isFighting, setIsFighting] = useState(false)
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [shipsOrigin, setShipsOrigin] = useState<Vector3>();
    const [shipsDestination, setShipsDestination] = useState<{objectLocation: ObjectLocation, objectType: ObjectType}>();
    const isFighter = (shipType === "fighter" || shipType === "hawk")

    const shipsDestinationPos = useMemo(() => {
      return shipsDestination?.objectLocation?.meshRef?.position || shipsDestination?.objectLocation.position
    }, [shipsDestination])

    useEffect(() => {
      setShipRef(meshRef.current, shipId);
    }, []);

    useEffect(() => {
      if (!isSelected) return;
      const abc = destination?.objectLocation?.meshRef?.position || destination?.objectLocation?.position
      if (destination && abc !== shipsDestinationPos) {
        if(isFighting) setIsFighting(false)
          if(destination.type === "Travel") return
        abc && destination.objectLocation && setShipsDestination({objectLocation: destination.objectLocation, objectType: destination.objectType});
      }
      if (origin && origin?.meshRef?.position && origin.meshRef.position !== shipsOrigin) {
        setShipsOrigin(origin.meshRef.position);
      }
      else if (origin?.position && origin?.position !== shipsOrigin) {shipType === "cargo" && setSelected("5", true); setShipsOrigin(origin.position)};
      if(isFighter) setShipsOrigin(meshRef.current.position)
    }, [destination, origin]);
  
    useEffect(() => {
      if (shipsOrigin && shipsDestination) {
        setIsTraveling(true);
        
      }

    }, [shipsOrigin, shipsDestination]);

    const calculateDirectionAndRotation = (targetPosition: Vector3) => {
        if (!meshRef.current) return {};
        const distance = meshRef.current.position.distanceTo(targetPosition);
        const direction = new Vector3()
          .subVectors(targetPosition, meshRef.current.position)
          .normalize();
          if(meshRef.current.shipShift){
            
            const shipShift = meshRef.current.shipShift
          const shiftToLeft = shipShift.shift
          const shiftAngleRadians = THREE.MathUtils.degToRad(45 * shipShift.multiplyer *(distance < 150 ? 0.8 : distance < 100 ? 0.6 : distance < 50 ? 0.4 : distance < 25 ? 0.2 : distance < 12.5 ? 0 : 1));
          const rotationAxis = new Vector3(0, 1, 0);
          const shiftQuaternion = new THREE.Quaternion().setFromAxisAngle(
            rotationAxis,
            shiftToLeft === "right" ? shiftAngleRadians : -shiftAngleRadians
          );
          direction.applyQuaternion(shiftQuaternion);
        }
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
    
        const speedFactor = Math.max(isFighter ? 55 : 25); // Adjust for sensitivity
        meshRef.current.position.add(
          direction.multiplyScalar((55 * speedFactor) / 5000)
        );
        meshRef.current.quaternion.slerp(targetQuaternion, 0.1);
      };

      useFrame(() => {
        if (
          meshRef.current &&
          shipsDestination &&
          shipsOrigin &&
          (isTraveling || isReturning)
        ) {
          if(!meshRef.current.name) {meshRef.current.name = shipId}
          const targetPosition = isTraveling && shipsDestination ? shipsDestinationPos : shipsOrigin;
          const { direction, targetQuaternion } =
            calculateDirectionAndRotation(targetPosition);
    
          direction &&
            updateShipPosition(direction, targetQuaternion, targetPosition);
        }
        else if (isFighting && shipsDestination) {
          const { direction, targetQuaternion } =
            calculateDirectionAndRotation(shipsDestinationPos);
            const theAngle = targetQuaternion?.angleTo(meshRef.current.quaternion)
            if(theAngle && theAngle > 0.01) {
              meshRef.current.quaternion.slerp(targetQuaternion, 0.5);
            }
        }
      });

      return <group>
        <ShipSound
          isHarvesting={isHarvesting}
          isReturning={isReturning}
          isTraveling={isTraveling}
          meshRef={meshRef}
        />
        {(isFighter) && (
          <LaserCannon
            position={meshRef.current ? meshRef.current.position : new Vector3(0,0,0)}
            setFightDone={() => setIsFighting(false)}
            target={shipsDestination}
            color={shipType === "hawk" ? 'green' : 'red'}
            fire={isFighting}
          />
        )}
         {(isTraveling || isReturning) && <Ignition type={shipType} />}
        {isHarvesting && shipType !== "fighter" && (
          <HarvestLaser isHarvesting={isHarvesting} />
        )}
      </group>
}

export default Navigation