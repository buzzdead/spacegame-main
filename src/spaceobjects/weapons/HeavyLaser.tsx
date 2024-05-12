import { useFrame } from "@react-three/fiber";
import { createRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import useStore from "../../store/UseStore";
import Shader from "../../postprocessing/Shader";
import { getDistance, getDistanceType, LaserRef, LaserTypes } from "./weaponTypes";
import { ObjectLocation } from "../../store/UseOriginDestination";

interface Props {
  origin: THREE.Vector3;
  target: ObjectLocation[];
  shipRef: any;
  sound: THREE.PositionalAudio | undefined
}

const HLS = LaserTypes["HeavyLaser"]

const HeavyLaser = ({ target: myTarget, origin, shipRef, sound }: Props) => {
  const TARGET_LENGTH = myTarget.length
  const dealDamageToEnemy = useStore((state) => state.dealDamageToEnemy);
  const hit = useRef(false);
  const lastKnownTarget = useRef<any>();
  const laserRefs = useRef(
    [...Array(3)].map(() =>
      createRef<LaserRef>()
    )
  );
  const goRef = useRef<boolean[]>([true, (TARGET_LENGTH >= 2), TARGET_LENGTH >= 3]);
  const laserGeometry = new THREE.BoxGeometry(0.11, 0.11, 2);
  const pos = shipRef.current?.position || origin;

  useEffect(() => {
    resetsLaserRefs()
  }, [myTarget.length])

  useEffect(() => {
    sound?.stop()
    sound?.play()
  }, [])

  const { vs, fs } = Shader("laser-cannon");
  const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color("#edcf09") },
      color2: { value: new THREE.Color("#ff0000") },
      time: { value: 0 },
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  const laserMeshes = [
    new THREE.Mesh(laserGeometry.clone(), gradientMaterial.clone()),
    new THREE.Mesh(laserGeometry.clone(), gradientMaterial.clone()),
    new THREE.Mesh(laserGeometry.clone(), gradientMaterial.clone()),
  ];;

  useFrame(({ clock }) => {
    laserRefs.current.forEach((laserRef, id) => {
      if (!goRef.current[id] || hit.current) return;
      const currentTarget = myTarget[id % TARGET_LENGTH].meshRef.position.clone() ?? lastKnownTarget.current;
      const lr = laserRef.current;
      if (lr && currentTarget) {
        lastKnownTarget.current = myTarget[id % TARGET_LENGTH]?.meshRef.position.clone();
        if (laserMeshes[id].material.uniforms.time)
          laserMeshes[id].material.uniforms.time.value =
            clock.getElapsedTime() * 1.5;
            //could probably be extracted
            //const newCurrentTarget = currentTarget.clone()
            //newCurrentTarget.x -= 10
        const direction = new THREE.Vector3()
          .subVectors(currentTarget, origin)
          .normalize();
        const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          direction
        );
        lr.position.add(direction.multiplyScalar((55 * HLS.speed) / 5000));
        lr.quaternion.slerp(targetQuaternion, 0.1);
        //to here
        handleLaserByDistanceType(lr, id, currentTarget);
      }
    });
  });

  const handleLaserByDistanceType = (
    laserRef: LaserRef,
    id: number,
    currentTarget: THREE.Vector3
  ) => {
    if (!laserRef) return;

    const dst = getDistance(laserRef.position, currentTarget);
    const distanceType = getDistanceType(dst, id);
    if (distanceType === "fireNext" && ((id === 0 && TARGET_LENGTH === 1) || (id === 1 && TARGET_LENGTH < 3)))  {goRef.current[id + 1] = true; !sound?.isPlaying && sound?.play()}
    if (distanceType === "dissipate")
      laserRef.scale.multiply(new THREE.Vector3(0.95, 0.95, 0.95));
    if (distanceType === "stop") {
      const report = dealDamageToEnemy(myTarget[id % TARGET_LENGTH].id, dst > 100 ? 0 : 17, true);
      goRef.current[id] = false;
      laserRef.scale.set(0, 0, 0);
      if (goRef.current.every(v => v === false)) {
        hit.current = true;
        if (report === "Destroyed" || report === "Not Found") return;
        resetsLaserRefs()
      }
    }
  };


  const resetsLaserRefs = () => {
    hit.current = false;
    goRef.current = [true, (TARGET_LENGTH >= 2), TARGET_LENGTH >= 3];
    laserRefs.current.forEach((lr) => {
      const lrc = lr.current;
      if (!lrc) return;
      lrc.scale.set(3, 3, 3);
      lrc.position.set(pos.x, pos.y, pos.z);
    });
  };

  return (
    <group>
      {laserRefs.current.map((lr, id) => (
        <mesh key={id} position={pos} ref={lr} scale={[3, 3, 3]}>
          <primitive object={laserMeshes[id]} />
        </mesh>
      ))}
    </group>
  );
};

export default HeavyLaser;
