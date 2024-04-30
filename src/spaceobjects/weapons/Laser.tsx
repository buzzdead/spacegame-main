import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import useStore from "../../store/useStore";

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
  const [lasherMeshes, setLasherMeshes] = useState<arr>([]);
  const laserGeometry = new THREE.BoxGeometry(0.2, 0.2, 5);
  const gradientMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color1: { value: new THREE.Color('red') },
      color2: { value: new THREE.Color('orange') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
  varying vec2 vUv;
  uniform vec3 color1;
  uniform vec3 color2;
  void main() {
    float gradient = vUv.x * vUv.x * 0.8; // non-linear gradient
    vec3 color = mix(color1, color2, gradient);
    gl_FragColor = vec4(color, 1.0);
  }
`,
  });
  const laserMesh = new THREE.Mesh(laserGeometry, gradientMaterial);
  laserMesh.position.x -= second ? 10.8 : 5;
  laserMesh.position.z += 3;
  const distance = origin.distanceTo(target);
  useEffect(() => {
    if (!fire) return;
    const lm = laserMesh.clone();
    setLasherMeshes([...lasherMeshes, lm]);
    laserSound.stop();
    laserSound.play();
    return () => {
      scene.remove(lm);
    };
  }, [fire, autoAttack]);

  useFrame(() => {
    lasherMeshes.forEach((mesh) => {
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
        setLasherMeshes((prevMeshes) => prevMeshes.filter((m) => m !== mesh));
        if (!destroyed) {
          setTimeout(() => setAutoAttack(!autoAttack), 150);
        } else {
          setLasherMeshes([]);
          setFightDone();
        }
      }
    });
  });

  return (
    <mesh ref={laserRef}>
      {lasherMeshes.map((lm) => (
        <primitive key={lm.id} object={lm} />
      ))}
    </mesh>
  );
};

export default Laser;
