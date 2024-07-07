import { useEffect, useMemo, useRef, useState } from "react";
import HeavyLaser from "../../weapons/HeavyLaser";
import MemoizedRadar from "./RadarScanner";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { ObjectLocation } from "../../../store/storeSlices/UseOriginDestination";
import UseSoundEffect from "../../../hooks/SoundEffect";
import { TheBeam } from "../../weapons/Frontal/TheBeam";
import { ShipBeam } from "../../tools/nebula/nebulaSystem";
import { useTexture } from "../../../hooks/Texture";

interface Props {
  nearby: any;
  shipRef: any;
  targetRef: any;
  distance: number
}

export const EnemyShipSystem = ({
  nearby: nearbyRef,
  shipRef,
  targetRef,
  distance
}: Props) => {
  const [nearbyEnemies, setNearbyEnemies] = useState<ObjectLocation[]>([]);
  const lookingAtTarget = useRef(false);
  const { camera } = useThree();
  const [nearby, setNearBy] = useState(false)

  useFrame(() => {
    if (!nearby || !nearbyEnemies[0]?.meshRef?.position) return;
    const dst = nearbyEnemies[0]?.meshRef?.position.distanceTo(shipRef?.current?.position)
    if (dst > 100) return
    const direction = new THREE.Vector3()
      .subVectors(nearbyEnemies[0]?.meshRef?.position, shipRef?.current?.position || origin)
      .normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      direction
    );
    const angle = shipRef.current.quaternion.angleTo(targetQuaternion);
    lookingAtTarget.current = angle < 0.18;
    shipRef.current.quaternion.slerp(targetQuaternion, 0.008);
  });
  const { sound: laserSound, calculateVolume: calculateLaserSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/laser.mp3",
      minVolume: 0.15,
      detune: -550,
    });
  const { sound: beamSound, calculateVolume: calculateBeamSound } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/beam.mp3",
      minVolume: 0.15,
      detune: 300,
    });
  useEffect(() => {
    if (shipRef?.current?.position) {
      const newPos = shipRef.current.position;
      calculateBeamSound(newPos);
      calculateLaserSound(newPos);
    }
  }, [camera.position, nearbyEnemies]);
  useEffect(() => {
    nearbyRef.current = nearbyEnemies.length > 0
    targetRef.current = nearbyEnemies.length > 0 ? nearbyEnemies[0] : null;
  }, [nearbyEnemies]);
  const beamTexture = useTexture("explosion08.png");

  return (
    <group>
      {nearbyEnemies.length > 0 && (
        <HeavyLaser
          sound={laserSound}
          shipRef={shipRef}
          target={nearbyEnemies}
        />
      )}
      <MemoizedRadar
        shipRef={shipRef}
        toggleNearBy={(b: boolean) => setNearBy(b)}
        nearby={nearbyRef}
        setNearbyEnemies={setNearbyEnemies}
        distance={distance}
      />
      {nearby && (
        <TheBeam
          target={nearbyEnemies[0]}
          distance={distance}
          sound={beamSound}
          nearbyRef={lookingAtTarget}
          position={shipRef.current?.position || origin}
          rotation={shipRef.current?.rotation || new THREE.Vector3(0, 0, 0)}
        />
      )}
    </group>
  );
};
