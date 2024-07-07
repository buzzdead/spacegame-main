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
}: Props) => {
  // just testing stuff
  const keyMap = useKeyboard();
  const [devFire, setDevFire] = useState(false);
  const devMode = false;
  // just testing stuff

  const { scene } = useThree();
  const [autoAttack, setAutoAttack] = useState(false);

  const weaponRef = useRef<any>(scene);

  const [splash, setSplash] = useState({
    active: false,
    position: new THREE.Vector3(0, 0, 0),
  });

  const [weaponMeshes, setWeaponMeshes] = useState<MeshType[]>([]);

  const { mesh, material } = useFrontalWeapon(weaponType, mountPosition, color);

  const { dealDamageToEnemy, dealDamageToConstruction } = useShallowStore(["dealDamageToConstruction", "dealDamageToEnemy"])
  
  const devTarget = mesh.position.clone();
  devTarget.z += 50;

  const distance = target
    ? origin.distanceTo(
        target?.objectLocation.meshRef?.position ||
          target.objectLocation.position
      )
    : new THREE.Vector3(0, 0, 0);

  const fireNewFrontAttack = () => {
    const newMaterial = material.clone();
    newMaterial.uniforms = THREE.UniformsUtils.clone(material.uniforms);

    const newMesh = mesh.clone();
    newMesh.material = newMaterial;
    setWeaponMeshes([...weaponMeshes, newMesh]);
    sound.stop();
    sound.play();
    return newMesh;
  };

  useEffect(() => {
    if (!fire && !devFire) return;
    const newMesh = fireNewFrontAttack();
    return () => {
      scene.remove(newMesh);
    };
  }, [fire, devFire, autoAttack]);

  const dealDamageToTarget = (objectType: any, id: any) => {
    return objectType === "Ship"
    ? dealDamageToEnemy(
        id,
        weaponType === "plasma" ? 20 : 2.5
      )
    : dealDamageToConstruction(
        id,
        weaponType === "plasma" ? 20 : 2.5
      );
  }

  const updateFrontAttack = (weaponMesh: MeshType, time: number) => {
    if (target) {
      weaponMesh.position.z += weaponType === "laser" ? 1 : 0.31;
      if (weaponMesh.position.z >= distance) {
        const destroyed = dealDamageToTarget(target.objectType, target.objectLocation.id)
        scene.remove(weaponMesh);
        weaponMesh.removeFromParent();
        setWeaponMeshes((prevMeshes) =>
          prevMeshes.filter((m) => m !== weaponMesh)
        );
        if (weaponType === "plasma") {
          setSplash({ active: true, position: weaponMesh.position });
          setTimeout(
            () =>
              setSplash({
                active: false,
                position: new THREE.Vector3(0, 0, 0),
              }),
            1000
          );
        }
        if (destroyed === "Hit") {
          setTimeout(() => setAutoAttack(!autoAttack), 150);
        } else {
          setWeaponMeshes([]);
          setFightDone();
        }
      }
    } else if (devTarget && devFire) {
      weaponMesh.position.z += weaponType === "laser" ? 1 : 0.61;
      if (weaponMesh.position.z > 50) {
        scene.remove(weaponMesh);
        weaponMesh.removeFromParent();
        setWeaponMeshes((prevMeshes) =>
          prevMeshes.filter((m) => m !== weaponMesh)
        );
        setDevFire(false);
        if (weaponType === "plasma") {
          setSplash({ active: true, position: weaponMesh.position });
          setTimeout(
            () =>
              setSplash({
                active: false,
                position: new THREE.Vector3(0, 0, 0),
              }),
            1000
          );
        }
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
      {weaponType === "plasma" && <PlasmaSplash position={splash.position} color={color} active={splash.active} />}
      {weaponMeshes.map((wm) => (
        <primitive key={wm.id} object={wm}>
          {weaponType === "plasma" && (
            <Electricity2 count={2000} color="#4488ff" radius={2.36} />
          )}
        </primitive>
      ))}
    </mesh>
  );
};

export default FrontalMountedWeapon;
