import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import useStore from "../../store/UseStore";
import Shader from "../../postprocessing/Shader";
import { ObjectType } from "../../store/StoreState";
import { ObjectLocation } from "../../store/storeSlices/UseOriginDestination";
import { useKeyboard } from "../../hooks/Keys";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { Electricity } from "./Electricity";
import { Electricity2 } from "./Electricity2";
import SplashParticles from "./SplashParticles";

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
  const { scene } = useThree();
  const [autoAttack, setAutoAttack] = useState(false);
  const dealDamageToEnemy = useStore((state) => state.dealDamageToEnemy);
  const dealDamageToConstruction = useStore(
    (state) => state.dealDamageToConstruction
  );
  const weaponRef = useRef<any>(scene);
  const [splash, setSplash] = useState({
    active: false,
    position: new THREE.Vector3(0, 0, 0),
  });
  const [weaponMeshes, setWeaponMeshes] = useState<MeshType[]>([]);

  const keyMap = useKeyboard();
  const [devFire, setDevFire] = useState(false);
  const devMode = false;

  const geometry =
    weaponType === "laser"
      ? new THREE.BoxGeometry(0.2, 0.2, 5)
      : new THREE.IcosahedronGeometry(2.35, 3);

  const { vs, fs } = Shader(
    weaponType === "laser" ? "laser-cannon" : "plasma-ball"
  );

  const { vs: vertexSplash, fs: fragmentSplash } = Shader("plasma-splash");

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(color) },
        color2: {
          value: new THREE.Color(weaponType === "laser" ? "green" : 0x3366ff),
        },
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
  }, []);

  const divergence = weaponType === "laser" ? 2.85 : 5;

  const mesh = useMemo(() => {
    const theMesh = new THREE.Mesh(geometry, material);
    theMesh.position.x -=
      mountPosition === "left"
        ? weaponType === "plasma"
          ? -6.5
          : -divergence
        : divergence;
    theMesh.position.z += 3;
    return theMesh;
  }, []);

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

  const splashMesh = useMemo(() => {
    const splashGeometry = new THREE.IcosahedronGeometry(2, 5);
    const splashMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color(color) },
        color2: { value: new THREE.Color(0x3366ff) },
        time: { value: 0 },
        duration: { value: 0 },
      },
      vertexShader: vertexSplash,
      fragmentShader: fragmentSplash,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const splashMesh = new THREE.Mesh(splashGeometry, splashMaterial);
    return splashMesh;
  }, []);

  const updateFrontAttack = (weaponMesh: MeshType, time: number) => {
    if (target) {
      if (weaponType === "laser" && weaponMesh.position.z >= distance - 10) {
       
      }

      weaponMesh.position.z += weaponType === "laser" ? 1 : 0.31;
      if (weaponMesh.position.z >= distance) {
        const destroyed =
          target.objectType === "Ship"
            ? dealDamageToEnemy(
                target.objectLocation.id,
                weaponType === "plasma" ? 10 : 2.5
              )
            : dealDamageToConstruction(
                target.objectLocation.id,
                weaponType === "plasma" ? 10 : 2.5
              );
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
          if (splashMesh) {
            splashMesh.material.uniforms.time.value = 0;
            splashMesh.material.uniforms.duration.value = 0;
          }
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
          if (splashMesh) {
            splashMesh.material.uniforms.time.value = 0;
            splashMesh.material.uniforms.duration.value = 0;
          }
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
    if (splash.active) {
      splashMesh.material.uniforms.time.value += 5;
      splashMesh.material.uniforms.duration.value += 0.0085;
    }
  });

  return (
    <mesh ref={weaponRef}>
      {splash.active && (
        <group>
          <primitive position={splash.position} object={splashMesh} />
          <SplashParticles
            size={1.5}
            color="purple"
            position={splash.position.clone()}
          />{" "}
        </group>
      )}
      {weaponMeshes.map((wm) => (
        <group>
          <primitive key={wm.id} object={wm}>
            {weaponType === "plasma" && (
              <Electricity2 count={2000} color="#4488ff" radius={2.36} />
            )}
          </primitive>
        </group>
      ))}
    </mesh>
  );
};

export default FrontalMountedWeapon;
