import { useEffect, useRef, useState } from "react";
import HeavyLaser from "../../weapons/HeavyLaser";
import { RadarScanner } from "./RadarScanner";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { ObjectLocation } from "../../../store/storeSlices/UseOriginDestination";
import UseSoundEffect from "../../../hooks/SoundEffect";
import { TheBeam } from "../../weapons/TheBeam";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";

interface Props {
  origin: THREE.Vector3;
  nearby: boolean;
  currentPos: THREE.Vector3;
  shipRef: any;
  targetRef: any;
}

export const EnemyShipSystem = ({
  origin,
  nearby,
  currentPos,
  shipRef,
  targetRef,
}: Props) => {
  const [nearbyEnemies, setNearbyEnemies] = useState<ObjectLocation[]>([]);
  const lookingAtTarget = useRef(false);
  const { camera } = useThree();
  useFrame(() => {
    if (!nearby || !nearbyEnemies[0]?.meshRef?.position) return;
    const direction = new THREE.Vector3()
      .subVectors(nearbyEnemies[0]?.meshRef?.position, origin)
      .normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      direction
    );
    const angle = shipRef.current.quaternion.angleTo(targetQuaternion);
    lookingAtTarget.current = angle < 0.25;
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
    } else {
      calculateBeamSound(currentPos);
      calculateLaserSound(currentPos);
    }
  }, [camera.position, nearbyEnemies]);
  useEffect(() => {
    targetRef.current = nearbyEnemies.length > 0 ? nearbyEnemies[0] : null;
  }, [nearbyEnemies]);
  return (
    <group>
      {nearbyEnemies.length > 0 && (
        <HeavyLaser
          sound={laserSound}
          shipRef={shipRef}
          origin={currentPos}
          target={nearbyEnemies}
        />
      )}
      <RadarScanner
        currentPos={currentPos}
        nearby={nearby}
        origin={origin}
        setNearbyEnemies={setNearbyEnemies}
      />
      {nearby && (
        <TheBeam
          target={nearbyEnemies[0]}
          sound={beamSound}
          nearbyRef={lookingAtTarget}
          position={shipRef.current?.position || origin}
          rotation={shipRef.current?.rotation || new THREE.Vector3(0, 0, 0)}
        />
      )}
    </group>
  );
};
