// PlasmaBeam.tsx

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import useStore from "../../store/UseStore";
import Shader from "../../postprocessing/Shader";
import { ObjectType } from "../../store/StoreState";
import { ObjectLocation } from "../../store/storeSlices/UseOriginDestination";

interface Props {
  origin: any;
  target: {objectLocation: ObjectLocation, objectType: ObjectType} | undefined
  color: string;
  plasmaSound: any;
  setFightDone: () => void;
  second?: boolean;
  fire?: boolean;
}

type PlasmaSphereMesh = THREE.Mesh<
  THREE.SphereGeometry,
  THREE.ShaderMaterial,
  THREE.Object3DEventMap
>;

const PlasmaBall = ({
  origin,
  target,
  second = false,
  fire = false,
  color,
  plasmaSound,
  setFightDone,
}: Props) => {
  const { scene } = useThree();
  const [autoAttack, setAutoAttack] = useState(false);
  const dealDamageToEnemy = useStore((state) => state.dealDamageToEnemy);
  const dealDamageToConstruction = useStore((state) => state.dealDamageToConstruction)
  const plasmaRef = useRef<any>(scene);
  const [plasmaSpheres, setPlasmaSpheres] = useState<PlasmaSphereMesh[]>([]);
  const plasmaGeometry = new THREE.SphereGeometry(1.25, 32, 32);
  const {vs, fs} = Shader("plasma-ball")
  const plasmaMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(0xff3366) }, // Pinkish red
      color2: { value: new THREE.Color(0x3366ff) }, // Blue
      time: { value: 0 },
    },
    vertexShader: vs,
    fragmentShader: fs,
    depthWrite: false,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
 
  const plasmaSphere = new THREE.Mesh(plasmaGeometry, plasmaMaterial);
  plasmaSphere.position.x -= second ? -2.85 : 2.85;
  plasmaSphere.position.z += 3;
  
  const distance = target ? origin.distanceTo(target?.objectLocation.meshRef?.position || target.objectLocation.position) : new THREE.Vector3(0,0,0);

  useEffect(() => {
    if (!fire) return;
    const newMaterial = plasmaMaterial.clone();
    newMaterial.uniforms = THREE.UniformsUtils.clone(plasmaMaterial.uniforms);
  
    const sphere = plasmaSphere.clone();
    sphere.material = newMaterial;
    setPlasmaSpheres([...plasmaSpheres, sphere]);
    plasmaSound.stop();
    plasmaSound.play();
  
    return () => {
      scene.remove(sphere);
    };
  }, [fire, autoAttack]);

  useFrame(({clock}) => {
    if(!target) return
    plasmaSpheres.forEach((sphere) => {
      if (sphere.material.uniforms.time) {
        sphere.material.uniforms.time.value = clock.getElapsedTime() ;
      }
      sphere.position.z += 0.31;
      if (sphere.position.z >= distance) {
        const destroyed = target.objectType === "Ship" ? dealDamageToEnemy(target.objectLocation.id, 2.5) : dealDamageToConstruction(target.objectLocation.id, 2.5)
        scene.remove(sphere);
        sphere.removeFromParent();
        setPlasmaSpheres((prevSpheres) => prevSpheres.filter((s) => s !== sphere));
        if (destroyed === "Hit") {
          setTimeout(() => setAutoAttack(!autoAttack), 150);
        } else {
          setPlasmaSpheres([]);
          setFightDone();
        }
      }
    });
  });

  return (
    <mesh ref={plasmaRef}>
      {plasmaSpheres.map((ps) => (
        <primitive key={ps.id} object={ps} />
      ))}
    </mesh>
  );
};

export default PlasmaBall;