import { useEffect, useMemo, useRef, useState } from "react";
import { TextureLoader, Vector3 } from "three";
import { ShipBeam } from "../tools/nebula/nebulaSystem";
import { useFrame } from "@react-three/fiber";
import useStore from "../../store/UseStore";
import { ObjectLocation } from "../../store/storeSlices/UseOriginDestination";
import { useTexture } from "../../hooks/Texture";

interface Props {
  position: Vector3;
  rotation: Vector3 | any;
  nearbyRef: any;
  sound: any;
  target: ObjectLocation;
  distance: number;
}

export const TheBeam = ({
  position,
  rotation,
  nearbyRef,
  sound,
  target,
  distance,
}: Props) => {
  const [shouldBeam, setShouldBeam] = useState(false);
  const dealDamageToEnemy = useStore((state) => state.dealDamageToEnemy);
  const beamDamageRef = useRef(0);
  useFrame(() => {
    const dst = position.distanceTo(target.meshRef.position);
    if (nearbyRef.current !== shouldBeam && dst <= 100)
      setShouldBeam(nearbyRef.current);
    if (shouldBeam) {
      beamDamageRef.current += 1;
      if (beamDamageRef.current >= 100) {
        dealDamageToEnemy(target.id, 15, true);
        beamDamageRef.current = 0;
      }
    }
  });
  const beamTexture = useTexture("explosion08.png");

  useEffect(() => {
    if (shouldBeam) {
      sound?.stop();
      sound?.play();
    }
  }, [shouldBeam]);

  return shouldBeam ? (
    <ShipBeam texture={beamTexture} rotation={rotation} position={position} />
  ) : null;
};
