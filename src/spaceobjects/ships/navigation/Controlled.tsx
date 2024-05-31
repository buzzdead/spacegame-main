import { useEffect, useMemo, useState } from "react";
import { Vector3, Quaternion } from "three";
import { useShallowStore } from "../../../store/UseStore";
import { SpaceShipId } from "../../../store/StoreAssets";
import { useFrame } from "@react-three/fiber";
import ShipSound from "../ShipSound";
import * as THREE from "three";
import { LaserCannon } from "../../weapons/LaserCannon";
import { Ignition } from "../../tools/Ignition";
import { HarvestLaser } from "../../tools/HarvestLaser";
import { ObjectType } from "../../../store/StoreState";
import { ObjectLocation } from "../../../store/storeSlices/UseOriginDestination";

interface Props {
  shipType: SpaceShipId;
  shipId: string;
  meshRef: any;
  isSelected: any;
}

export const Controlled = ({ shipId, meshRef, shipType, isSelected }: Props) => {
  const {
    destination,
    setResources,
    origin,
    setShipRef,
    setSelected,
    setMissionComplete,
  } = useShallowStore([
    "destination",
    "setResources",
    "origin",
    "setShipRef",
    "setSelected",
    "setMissionComplete",
  ]);
  const [isTraveling, setIsTraveling] = useState(false);
  const [isReturning, setIsReturning] = useState(false);
  const [isFighting, setIsFighting] = useState(false);
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [shipsOrigin, setShipsOrigin] = useState<Vector3>();
  const [shipsDestination, setShipsDestination] = useState<{
    objectLocation: ObjectLocation;
    objectType: ObjectType;
  }>();
  const isFighter = shipType === "fighter" || shipType === "hawk";

  const shipsDestinationPos = useMemo(() => {
    return (
      shipsDestination?.objectLocation?.meshRef?.position ||
      shipsDestination?.objectLocation.position
    );
  }, [shipsDestination]);

  useEffect(() => {
    setShipRef(meshRef.current, shipId);
  }, []);

  const passDestinationOrigin = () => {
    if (!isSelected.current && shipType !== "hullspaceship") return true;
    if (
      destination?.objectType === "MissionItem" &&
      shipType !== "hullspaceship"
    )
      return true;
    if (
      shipType === "hullspaceship" &&
      destination?.objectType !== "MissionItem"
    )
      return true;
    if (destination && destination.type === "Travel") return true;
    return false;
  };

  const updateShipsDestination = () => {
    const pos =
      destination?.objectLocation?.meshRef?.position ||
      destination?.objectLocation?.position;
    if (destination && pos !== shipsDestinationPos) {
      if (isFighting) setIsFighting(false);
      pos &&
        destination.objectLocation &&
        setShipsDestination({
          objectLocation: destination.objectLocation,
          objectType: destination.objectType,
        });
    }
  };

  const updateShipsOrigin = () => {
    if (
      origin &&
      origin?.meshRef?.position &&
      origin.meshRef.position !== shipsOrigin
    ) {
      setShipsOrigin(origin.meshRef.position);
    } else if (origin?.position && origin?.position !== shipsOrigin) {
      shipType === "cargo" && setSelected(shipId);
      setShipsOrigin(origin.position);
    }
    if (isFighter || shipType === "hullspaceship")
      setShipsOrigin(meshRef.current.position);
  };

  useEffect(() => {
    if (passDestinationOrigin()) return;
    updateShipsDestination();
    updateShipsOrigin();
  }, [destination, origin]);

  useEffect(() => {
    if (shipsOrigin && shipsDestination) {
      setIsTraveling(true);
    }
  }, [shipsOrigin, shipsDestination]);

  const getShift = (targetPosition: Vector3) => {
    const distance = meshRef.current.position.distanceTo(targetPosition);
    const shipShift = meshRef.current.shipShift;
    const shiftToLeft = shipShift.shift;
    const shiftAngleRadians = THREE.MathUtils.degToRad(
      45 *
        shipShift.multiplyer *
        (distance < 150
          ? 0.8
          : distance < 100
          ? 0.6
          : distance < 50
          ? 0.4
          : distance < 25
          ? 0.2
          : distance < 12.5
          ? 0
          : 1)
    );
    const rotationAxis = new Vector3(0, 1, 0);
    const shiftQuaternion = new THREE.Quaternion().setFromAxisAngle(
      rotationAxis,
      shiftToLeft === "right" ? shiftAngleRadians : -shiftAngleRadians
    );
    return shiftQuaternion;
  };

  const calculateDirectionAndRotation = (targetPosition: Vector3) => {
    if (!meshRef.current) return {};
    const direction = new Vector3()
      .subVectors(targetPosition, meshRef.current.position)
      .normalize();
    if (meshRef.current.shipShift) {
      const shiftQuaternion = getShift(targetPosition);
      direction.applyQuaternion(shiftQuaternion);
    }
    const targetQuaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1), // Assuming front of your ship is along +Z
      direction
    );

    return { direction, targetQuaternion };
  };

  const stopBasedOnDistance = (targetPosition: Vector3, targetQuaternion: Quaternion) => {
    const distance = meshRef.current.position.distanceTo(targetPosition);
    const theAngle = targetQuaternion?.angleTo(meshRef.current.quaternion);

    return (
      distance <
        (isReturning
          ? 12
          : isFighter
          ? 70
          : shipType === "hullspaceship"
          ? 30
          : 7) &&
      theAngle < 0.05
    )
  }

  const updateShipPosition = (
    direction: Vector3,
    targetQuaternion: Quaternion,
    targetPosition: Vector3
  ) => {
    if (!meshRef.current) return;

    if (stopBasedOnDistance(targetPosition, targetQuaternion)) {
      if (isTraveling) {
        if (isFighter) {
          setIsFighting(true);
          setIsTraveling(false);
        } else if (shipType === "hullspaceship") {
          setMissionComplete("mission1");
          setIsTraveling(false);
        } else {
          setIsTraveling(false);
          setIsHarvesting(true);
          setTimeout(() => {
            setIsReturning(true);
            setIsHarvesting(false);
          }, 5000);
        }
      } else if (isReturning) {
        setIsReturning(false);
        setTimeout(() => {
          setIsTraveling(true);
          setResources(500);
        }, 3000);
      }
    }

    const speedFactor = Math.max(
      isFighter ? 75 : shipType === "hullspaceship" ? 100 : 12.5
    ); // Adjust for sensitivity
    meshRef.current.position.add(
      direction.multiplyScalar((55 * speedFactor) / 5000)
    );
    meshRef.current.quaternion.slerp(targetQuaternion, 0.5);
  };

  useFrame(() => {
    if (
      meshRef.current &&
      shipsDestination &&
      shipsOrigin &&
      (isTraveling || isReturning)
    ) {
      if (!meshRef.current.name) {
        meshRef.current.name = shipId;
      }
      const targetPosition =
        isTraveling && shipsDestination ? shipsDestinationPos : shipsOrigin;
      const { direction, targetQuaternion } =
        calculateDirectionAndRotation(targetPosition);

      direction &&
        updateShipPosition(direction, targetQuaternion, targetPosition);
    } else if (isFighting && shipsDestination) {
      const { direction, targetQuaternion } =
        calculateDirectionAndRotation(shipsDestinationPos);
      const theAngle = targetQuaternion?.angleTo(meshRef.current.quaternion);
      if (theAngle && theAngle > 0.01) {
        meshRef.current.quaternion.slerp(targetQuaternion, 0.01);
      }
    }
  });

  return (
    <group>
      <ShipSound
        isHarvesting={isHarvesting}
        isReturning={isReturning}
        isTraveling={isTraveling}
        meshRef={meshRef}
      />
      {isFighter && (
        <LaserCannon
        whatever={meshRef}
          position={
            meshRef.current ? meshRef.current.position : new Vector3(0, 0, 0)
          }
          setFightDone={() => setIsFighting(false)}
          target={shipsDestination}
          color={shipType === "hawk" ? "green" : "red"}
          fire={isFighting}
        />
      )}
      {(isTraveling || isReturning) && <Ignition type={shipType} />}
      {isHarvesting && shipType !== "fighter" && (
        <HarvestLaser isHarvesting={isHarvesting} />
      )}
    </group>
  );
};
