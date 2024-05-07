import { useEffect, useState } from "react";
import { Vector3, Quaternion } from 'three'
import { useShallowStore } from "../../store/UseStore";
import { SpaceShipId } from "../../store/StoreAssets";
import { useFrame } from "@react-three/fiber";
import ShipSound from "./ShipSound";
import { LaserCannon } from "../weapons/LaserCannon";
import { Ignition } from "../tools/Ignition";
import { HarvestLaser } from "../tools/HarvestLaser";

interface Props {
  shipType: SpaceShipId
  shipId: string
  meshRef: any
  isSelected: boolean
}

const Navigation = ({shipId, meshRef, shipType, isSelected}: Props) => {
    const { destination, setResources, origin, setSelected} = useShallowStore(["destination", "setResources", "origin", "setSelected"])
    const [isTraveling, setIsTraveling] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const [isFighting, setIsFighting] = useState(false)
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [shipsOrigin, setShipsOrigin] = useState<Vector3>();
    const [shipsDestination, setShipsDestination] = useState<{pos: Vector3, objectType: "Ship" | "Construction" | "Planet"}>({pos: new Vector3(0,0,0), objectType: "Construction"});
    const isFighter = (shipType === "fighter" || shipType === "hawk")

    useEffect(() => {
      if (!isSelected) return;
      if (destination && destination.pos !== shipsDestination.pos) {
        if(isFighting) setIsFighting(false)
          if(destination.type === "Travel") return
        setShipsDestination({pos: destination.pos, objectType: destination.objectType});
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
    
        const speedFactor = Math.max(isFighter ? 35 : 25); // Adjust for sensitivity
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
          const targetPosition = isTraveling ? shipsDestination.pos : shipsOrigin;
          const { direction, targetQuaternion } =
            calculateDirectionAndRotation(targetPosition);
    
          direction &&
            updateShipPosition(direction, targetQuaternion, targetPosition);
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