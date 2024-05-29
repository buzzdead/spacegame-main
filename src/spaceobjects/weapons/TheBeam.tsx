import { useEffect, useMemo, useRef, useState } from "react";
import { TextureLoader, Vector3 } from "three";
import { ShipBeam } from "../tools/test/nebulaSystem";
import { useFrame } from "@react-three/fiber";
import useStore from "../../store/UseStore";
import { ObjectLocation } from "../../store/storeSlices/UseOriginDestination";

interface Props {
  position: Vector3;
  rotation: Vector3 | any;
  nearbyRef: any;
  sound: any;
  target: ObjectLocation;
}

export const TheBeam = ({ position, rotation, nearbyRef, sound, target }: Props) => {
  const [shouldBeam, setShouldBeam] = useState(false);
  const dealDamageToEnemy = useStore(state => state.dealDamageToEnemy)
  const beamDamageRef = useRef(0)
  useFrame(() => {
    if (nearbyRef.current !== shouldBeam) setShouldBeam(nearbyRef.current);
    if(shouldBeam) {
      beamDamageRef.current += 1
      if(beamDamageRef.current >= 100) {dealDamageToEnemy(target.id, 15, true); beamDamageRef.current = 0}
    }

  });
  const particle = useMemo(() => {
    return require("./explosion00.png");
  }, []);

  const texture = useMemo(() => {
    return new TextureLoader().load(particle);
  }, []);

  useEffect(() => {
    if(shouldBeam) {sound?.stop(); sound?.play();}
  }, [shouldBeam])

  return shouldBeam ? (
    <ShipBeam texture={texture} rotation={rotation} position={position} />
  ) : null;
};
