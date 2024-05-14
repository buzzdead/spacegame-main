import { useEffect, useMemo, useState } from "react";
import { TextureLoader, Vector3 } from "three";
import { ShipBeam } from "../tools/test/ShipExplosion";
import { useFrame } from "@react-three/fiber";

interface Props {
  position: Vector3;
  rotation: Vector3 | any;
  nearbyRef: any;
  sound: any
}

export const TheBeam = ({ position, rotation, nearbyRef, sound }: Props) => {
  const [shouldBeam, setShouldBeam] = useState(false);
  useFrame(() => {
    if (nearbyRef.current !== shouldBeam) setShouldBeam(nearbyRef.current);
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
