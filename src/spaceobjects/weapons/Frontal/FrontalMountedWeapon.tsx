import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ObjectType } from "../../../store/StoreState";
import { ObjectLocation } from "../../../store/storeSlices/UseOriginDestination";
import { useKeyboard } from "../../../hooks/Keys";
import { Electricity2 } from "../Effects/Electricity2";
import { useFrontalWeapon } from "./useFrontalWeapon";
import { PlasmaSplash } from "./PlasmaSplash";
import { useShallowStore } from "../../../store/UseStore";

interface Props {
  origin: any;
  target:
    | { objectLocation: ObjectLocation; objectType: ObjectType }
    | undefined;
  color: string;
  sound: any;
  setFightDone: () => void;
  mountPosition: "left" | "right";
  fire?: boolean;
  weaponType: "laser" | "plasma";
  whatever: any;
}

type MeshType = THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;

const FrontalMountedWeapon = ({
  origin,
  target,
  mountPosition = "left",
  fire = false,
  color,
  sound,
  setFightDone,
  weaponType,
  whatever,
}: Props) => {
  // just testing stuff
  const keyMap = useKeyboard();
  const [devFire, setDevFire] = useState(false);
  const devMode = false;
  // just testing stuff

  const { scene } = useThree();
  const [autoAttack, setAutoAttack] = useState(false);

  const weaponRef = useRef<THREE.Mesh>(null);

  const [splash, setSplash] = useState({
    active: false,
    position: new THREE.Vector3(0, 0, 0),
  });

  const [weaponMeshes, setWeaponMeshes] = useState<
    { mesh: MeshType; target: any; distance: number }[]
  >([]);

  const { mesh, material } = useFrontalWeapon(weaponType, mountPosition, color);

  const { dealDamageToEnemy, dealDamageToConstruction } = useShallowStore([
    "dealDamageToConstruction",
    "dealDamageToEnemy",
  ]);

  const devTarget = mesh.position.clone();
  devTarget.z += 50;

  const didRemove = useRef(false);

  const fireNewFrontAttack = () => {
    // Keeping it here for now
    if (!didRemove.current && weaponRef.current) {
      didRemove.current = true;
      weaponRef.current.removeFromParent();
      weaponRef.current.name = whatever.current.name + ' - projectile'
      scene.add(weaponRef.current);
    } if (weaponRef.current) {
      weaponRef.current.position.copy(origin);
      weaponRef.current.quaternion.copy(whatever.current.quaternion);
    }
    // Keeping it here for now

    const newMaterial = material.clone();
    newMaterial.uniforms = THREE.UniformsUtils.clone(material.uniforms);

    const newMesh = mesh.clone();
    newMesh.material = newMaterial;
    const distance = target
      ? origin.distanceTo(
          target?.objectLocation.meshRef?.position ||
            target.objectLocation.position
        )
      : new THREE.Vector3(0, 0, 0);
    setWeaponMeshes([
      ...weaponMeshes,
      { mesh: newMesh, target: target, distance: distance },
    ]);
    sound.stop();
    sound.play();
    return newMesh;
  };

  useEffect(() => {
    if (!fire && !devFire) return;
    const newMesh = fireNewFrontAttack();
    return () => {
      weaponMeshes.forEach((wm) => handleRemove(wm.mesh));
    };
  }, [fire, devFire, autoAttack]);

  const dealDamageToTarget = (objectType: any, id: any) => {
    return objectType === "Ship"
      ? dealDamageToEnemy(id, weaponType === "plasma" ? 20 : 2.5)
      : dealDamageToConstruction(id, weaponType === "plasma" ? 20 : 2.5);
  };

  const handleRemove = (weaponMesh: any) => {
    scene.remove(weaponMesh);
    if (weaponRef.current) weaponRef.current.remove(weaponMesh);
    weaponMesh.removeFromParent();
    setWeaponMeshes((prevMeshes) =>
      prevMeshes.filter((m) => m.mesh !== weaponMesh)
    );
  };

  const handleSplash = (weaponMesh: any) => {
    setSplash({ active: true, position: weaponMesh.position });
    setTimeout(
      () =>
        setSplash({
          active: false,
          position: new THREE.Vector3(0, 0, 0),
        }),
      1000
    );
  };

  const handleHitTarget = (objectType: any, id: any, weaponMesh: any) => {
    const destroyed = dealDamageToTarget(objectType, id);
    if (weaponType === "plasma") {
      handleSplash(weaponMesh);
    }
    if (destroyed === "Hit") {
      setTimeout(() => setAutoAttack(!autoAttack), 150);
    } else {
      setWeaponMeshes([]);
      setFightDone();
    }
    handleRemove(weaponMesh);
  };

  const updateFrontAttack = (
    wm: { mesh: MeshType; target: any; distance: number },
    time: number
  ) => {
    if (target) {
      wm.mesh.position.z += weaponType === "laser" ? 1 : 0.31;
      if (wm.mesh.position.z >= wm.distance) {
        handleHitTarget(
          wm.target.objectType,
          wm.target.objectLocation.id,
          wm.mesh
        );
      }
    } else if (devTarget && devFire) {
      wm.mesh.position.z += weaponType === "laser" ? 1 : 0.61;
      if (wm.mesh.position.z > 50) {
        setDevFire(false);
        handleSplash(wm.mesh);
        handleRemove(wm.mesh);
      }
    }
  };

  useFrame(({ clock }) => {
    if (devMode && keyMap && keyMap["KeyF"]) {
      setDevFire(true);
    }
    weaponMeshes.forEach((mesh) => {
      updateFrontAttack(mesh, clock.getElapsedTime());
    });
  });

  return (
    <mesh ref={weaponRef}>
      {weaponType === "plasma" && (
        <PlasmaSplash
          position={splash.position}
          color={color}
          active={splash.active}
        />
      )}
      {weaponMeshes.map((wm) => (
        <primitive key={wm.mesh.id} object={wm.mesh}>
          {weaponType === "plasma" && (
            <Electricity2 count={2000} color="#4488ff" radius={2.36} />
          )}
        </primitive>
      ))}
    </mesh>
  );
};

export default FrontalMountedWeapon;
