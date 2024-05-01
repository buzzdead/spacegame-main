import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import useStore from "../../store/UseStore";
import Shader from "../../postprocessing/Shader";

interface Props {
  origin: any;
  target: any;
  color: string;
  laserSound: any;
  setFightDone: () => void;
  second?: boolean;
  fire?: boolean;
}

type a = THREE.Mesh<
  THREE.BoxGeometry,
  THREE.ShaderMaterial,
  THREE.Object3DEventMap
>;
type arr = a[];

const Laser = ({
  origin,
  target,
  second = false,
  fire = false,
  color,
  laserSound,
  setFightDone,
}: Props) => {
  const { scene } = useThree();
  const [autoAttack, setAutoAttack] = useState(false);
  const dealDamageToEnemy = useStore((state) => state.dealDamageToEnemy);
  const laserRef = useRef<any>(scene);
  const [laserMeshes, setLaserMeshes] = useState<arr>([]);
  const laserGeometry = new THREE.BoxGeometry(0.2, 0.2, 5);
  const {vs, fs} = Shader("laser-cannon")
  const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color(color) }, // Use the provided color prop
      color2: { value: new THREE.Color('green') }, // Mix with white for a glow effect
      time: { value: 0 },
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
 
  const laserMesh = new THREE.Mesh(laserGeometry, gradientMaterial);
  laserMesh.position.x -= second ? 10.8 : 5;
  laserMesh.position.z += 3;
  const distance = origin.distanceTo(target);
  useEffect(() => {
    if (!fire) return;
  
    // Create a new material instance for each clone
    const newMaterial = gradientMaterial.clone();
    newMaterial.uniforms = THREE.UniformsUtils.clone(gradientMaterial.uniforms);
  
    const mesh = laserMesh.clone();
    mesh.material = newMaterial; // Assign the new material to the clone
    setLaserMeshes([...laserMeshes, mesh]);
    laserSound.stop();
    laserSound.play();
  
    return () => {
      scene.remove(mesh);
    };
  }, [fire, autoAttack]);

  useFrame(({clock}) => {
    laserMeshes.forEach((mesh) => {
      if (mesh.material.uniforms.time) {
        mesh.material.uniforms.time.value = clock.getElapsedTime() * 2;
      }
      // Check for exceeding z limit and remove the mesh
      if (mesh.position.z >= distance - 10) {
        mesh.geometry.scale(0.9, 0.9, 0.9);
      }
      mesh.position.z += 1;

      // Deal damage to the target
      if (mesh.position.z >= distance) {
        const destroyed = dealDamageToEnemy(target, 5);
        scene.remove(mesh);
        mesh.removeFromParent();
        setLaserMeshes((prevMeshes) => prevMeshes.filter((m) => m !== mesh));
        if (!destroyed) {
          setTimeout(() => setAutoAttack(!autoAttack), 150);
        } else {
          setLaserMeshes([]);
          setFightDone();
        }
      }
    });
  });

  return (
    <mesh ref={laserRef}>
      {laserMeshes.map((lm) => (
        <primitive key={lm.id} object={lm} />
      ))}
    </mesh>
  );
};

export default Laser;
