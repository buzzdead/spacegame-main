import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber";
import useStore from "../../store/useStore";

interface Props {
    origin: any
    target: any
    color: string
    laserSound: any
    setFightDone: () => void
    second?: boolean
    fire?: boolean
}

type a = THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>
type arr = a[]

const Laser = ({ origin, target, second = false, fire = false, color, laserSound, setFightDone }: Props) => {
  const { scene } = useThree()
  const [autoAttack, setAutoAttack] = useState(false)
  const dealDamageToEnemy = useStore(state => state.dealDamageToEnemy)
    const laserRef = useRef<any>(scene);
    const [lasherMeshes, setLasherMeshes] = useState<arr>([])
    const laserGeometry = new THREE.BoxGeometry(.08, .08, 2);
    const laserMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 1,
    });
    const laserMesh = new THREE.Mesh(laserGeometry, laserMaterial);
    laserMesh.position.x -= second ? 5.95 : 2.75
    laserMesh.position.z += 3
    const distance = origin.distanceTo(target)
    useEffect(() => {
      if(!fire) return
        const lm = laserMesh.clone()
        setLasherMeshes([...lasherMeshes, lm])
        laserSound.stop()
        laserSound.play()
      return () => {
        scene.remove(lm)
      }
        
    }, [fire, autoAttack])
  
    useFrame(() => {
      lasherMeshes.forEach((mesh) => {
        // Check for exceeding z limit and remove the mesh
        if (mesh.position.z >= distance - 10) {
          mesh.geometry.scale(0.9, 0.9, 0.9)
        }
        mesh.position.z += 1;
  
        // Deal damage to the target
        if (mesh.position.z >= distance) {
          const destroyed = dealDamageToEnemy(target, 10)
          scene.remove(mesh)
          mesh.removeFromParent()
          setLasherMeshes((prevMeshes) => prevMeshes.filter((m) => m !== mesh))
          if(!destroyed){
            setTimeout(() => setAutoAttack(!autoAttack), 150)
          }
          else { setFightDone() }
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
  
  export default Laser