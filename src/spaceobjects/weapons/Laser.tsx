import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber";

interface Props {
    origin: any
    target: any
    second?: boolean
    fire?: boolean
}

type a = THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial, THREE.Object3DEventMap>
type arr = a[]

const Laser = ({ origin, target, second = false, fire = false }: Props) => {
    const laserRef = useRef<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>(null);
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
        setLasherMeshes([...lasherMeshes.filter(l => l.position.z < 60), lm])
        console.log(lasherMeshes.length)
    }, [fire])
  
    useFrame(() => {
        lasherMeshes.forEach((mesh) => {
          
    
          // Check for exceeding z limit and remove the mesh
          if (mesh.position.z >= 50) {
                mesh.geometry.scale(0.93,0.93, 0.9)
            } 
         mesh.position.z += 0.2;
            
        });
      });
  
    return <mesh ref={laserRef}>{lasherMeshes.map(lm => <primitive object={lm} />)}</mesh>;
  };
  

export default Laser