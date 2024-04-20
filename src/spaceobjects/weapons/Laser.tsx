import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { useFrame, useThree } from "@react-three/fiber";

interface Props {
    origin: any
    target: any
    second?: boolean
    fire?: boolean
}

type a = THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial, THREE.Object3DEventMap>
type arr = a[]

const Laser = ({ origin, target, second = false, fire = false }: Props) => {
  const { scene } = useThree()
    const laserRef = useRef<any>(scene);
    const [lasherMeshes, setLasherMeshes] = useState<arr>([])
    const laserGeometry = new THREE.BoxGeometry(.08, .08, 2); 
    const laserMaterial = new THREE.ShaderMaterial({
      transparent: true,
      opacity: 1,
    });
    const laserMesh = new THREE.Mesh(laserGeometry, laserMaterial);
    laserMesh.position.copy(origin);
    laserMesh.position.x -= second ? 5.95 : 2.75
    laserMesh.position.z += 3
    useEffect(() => {
        const lm = laserMesh.clone()
        const oldMeshes = lasherMeshes.filter(e => e.position.z >= 100)
        oldMeshes.forEach(m => {scene.remove(m); m.removeFromParent()})
        setLasherMeshes([...lasherMeshes.filter(l => l.position.z <= 100), lm])
      return () => {
        scene.remove(lm)
      }
        
    }, [fire])
  
    useFrame(() => {
        lasherMeshes.forEach((mesh) => {
          
    
          // Check for exceeding z limit and remove the mesh
          if (mesh.position.z >= 75) {
                mesh.geometry.scale(0.9,0.9, 0.9)
            } 
         mesh.position.z += 1;
            
        });
      });
  
    return <mesh ref={laserRef}>{lasherMeshes.map(lm => <primitive key={lm.id} object={lm} />)}</mesh>;
  };
  

export default Laser