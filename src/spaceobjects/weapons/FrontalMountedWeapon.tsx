import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import useStore from "../../store/UseStore";
import Shader from "../../postprocessing/Shader";
import { ObjectType } from "../../store/StoreState";
import { ObjectLocation } from "../../store/storeSlices/UseOriginDestination";
import { useKeyboard } from "../../hooks/Keys";

interface Props {
  origin: any;
  target: { objectLocation: ObjectLocation, objectType: ObjectType } | undefined;
  color: string;
  sound: any;
  setFightDone: () => void;
  mountPosition: "left" | "right"
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
  const { scene } = useThree();
  const [autoAttack, setAutoAttack] = useState(false);
  const dealDamageToEnemy = useStore((state) => state.dealDamageToEnemy);
  const dealDamageToConstruction = useStore((state) => state.dealDamageToConstruction);
  const weaponRef = useRef<any>(scene);
  const [weaponMeshes, setWeaponMeshes] = useState<MeshType[]>([]);

  const keyMap = useKeyboard()  
  const [devFire, setDevFire] = useState(false)
  const devMode = true

  const geometry = weaponType === "laser" 
    ? new THREE.BoxGeometry(0.2, 0.2, 5)
    : new THREE.IcosahedronGeometry(2.35, 3);

  const { vs, fs } = Shader(weaponType === "laser" ? "laser-cannon" : "plasma-ball");

  const material = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(color) },
      color2: { value: new THREE.Color(weaponType === "laser" ? 'green' : 0x3366ff) },
      time: { value: 0 },
    },
    vertexShader: vs,
    fragmentShader: fs,
    blending: THREE.AdditiveBlending,
    blendEquation: THREE.MinEquation,
    blendDst: THREE.OneMinusConstantAlphaFactor,
    blendSrc: THREE.ZeroFactor,
    blendEquationAlpha: THREE.CustomBlending,
  });

  const mesh = new THREE.Mesh(geometry, material);
  const divergence = weaponType === "laser" ? 2.85 : 5
  mesh.position.x -= mountPosition === "left" ? weaponType  === "plasma" ? -6.5 : -divergence : divergence;
  mesh.position.z += 3;
  const devTarget = mesh.position.clone()
  devTarget.z += 50

  const distance = target ? origin.distanceTo(target?.objectLocation.meshRef?.position || target.objectLocation.position) : new THREE.Vector3(0, 0, 0);

  const fireNewFrontAttack = () => {
    const newMaterial = material.clone();
    newMaterial.uniforms = THREE.UniformsUtils.clone(material.uniforms);

    const newMesh = mesh.clone();
    newMesh.material = newMaterial;
    setWeaponMeshes([...weaponMeshes, newMesh]);
    sound.stop();
    sound.play();
    return newMesh
  }

  useEffect(() => {
    if (!fire && !devFire) return;
    const newMesh = fireNewFrontAttack()
    return () => {
      scene.remove(newMesh);
    };
  }, [fire, devFire, autoAttack]);

  const updateFrontAttack = (weaponMesh: MeshType, time: number) => {
    if(target){
    if (weaponMesh.material.uniforms.time) {
        weaponMesh.material.uniforms.time.value = time * (weaponType === "laser" ? 2 : 1);
      }
      if (weaponType === "laser" && weaponMesh.position.z >= distance - 10) {
        weaponMesh.geometry.scale(0.9, 0.9, 0.9);
      }
      if(weaponType === "plasma") {
        weaponMesh.material.uniforms.time.value = time
      }
      weaponMesh.position.z += weaponType === "laser" ? 1 : 0.31;
      if (weaponMesh.position.z >= distance) {
        const destroyed = target.objectType === "Ship" ? dealDamageToEnemy(target.objectLocation.id, weaponType === "plasma" ? 10 : 2.5) : dealDamageToConstruction(target.objectLocation.id, weaponType === "plasma" ? 10 : 2.5);
        scene.remove(weaponMesh);
        weaponMesh.removeFromParent();
        setWeaponMeshes((prevMeshes) => prevMeshes.filter((m) => m !== weaponMesh));
        if (destroyed === "Hit") {
          setTimeout(() => setAutoAttack(!autoAttack), 150);
        } else {
          setWeaponMeshes([]);
          setFightDone();
        }
      }
      
    }
    else if(devTarget && devFire) {
        if(weaponType === "plasma") {
            weaponMesh.material.uniforms.time.value = time * .1
          }
          weaponMesh.position.z += weaponType === "laser" ? 1 : 0.61;
          if(weaponMesh.position.z > 50) {
            scene.remove(weaponMesh);
            weaponMesh.removeFromParent();
            setWeaponMeshes((prevMeshes) => prevMeshes.filter((m) => m !== weaponMesh));
            setDevFire(false)
          }
      }
  }

  useFrame(({ clock }) => {
    if(keyMap && keyMap["KeyF"]) {
        setDevFire(true)
    }
    weaponMeshes.forEach((mesh) => {
      updateFrontAttack(mesh, clock.getElapsedTime())
    });
  });

  return (
    <mesh ref={weaponRef}>
      {weaponMeshes.map((wm) => (
        <primitive key={wm.id} object={wm} />
      ))}
    </mesh>
  );
};

export default FrontalMountedWeapon;
