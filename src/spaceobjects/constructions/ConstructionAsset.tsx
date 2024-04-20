import { useFrame, useThree } from "@react-three/fiber";
import { useShallowStore } from "../../store/useStore";
import { useAsset } from "../useAsset";
import * as THREE from 'three'
import { Center, Text } from '@react-three/drei';
import { useRef } from "react";
import { Ship } from "../../store/spaceGameStateUtils";
import { spaceShips } from "../../store/storeAssets";

interface Props {
    shouldRender: boolean
    glbPath: string
    x?: number
    scale?: number
}

const ConstructionAsset = ({shouldRender, glbPath, x, scale}: Props) => {
    const { ships, addShip } = useShallowStore(["addShip", "ships"])
    const { camera } = useThree()
    const scene = useAsset(glbPath, scale || 8)
    const textRef = useRef<THREE.Mesh>(null)
    scene.position.y = x ? 13 : 12    
    scene.position.z = -2
    scene.position.x = x || 0
    
    const auraGeometry = new THREE.SphereGeometry(3, 32, 32);
    const auraMaterial = new THREE.MeshPhongMaterial({
        color: 'green',
        opacity: 0.0001,
        transparent: true,
        emissive: 'white', // Add this line to make the material glow
        emissiveIntensity: 55.5, // Adjust this value to control the glow intensity
      });
    const auraMesh = new THREE.Mesh(auraGeometry, auraMaterial);
    auraMesh.position.copy(scene.position);
    auraMesh.position.z += x ? 1 : 3
    auraMesh.position.x += x ? 1.5 : 0
    auraMesh.scale.setScalar(1.2); // adjust the scale to fit your needs
    useFrame(() => {
        if(textRef.current && textRef.current.rotation) { textRef.current.rotation.set(0,scene.children[0].rotation.y - 1.55,0)}
        scene.children[0].rotation.y += .01
    })
    const handleOnClick = (e: any) => {
        e.stopPropagation()
        addShip(x ? "hawk" : "fighter", [3 + ships.length * 15,0,3], x ? 0.55 : 11)
    }
    return shouldRender ? <mesh onClick={handleOnClick}><Text ref={textRef} position={[auraMesh.position.x, auraMesh.position.y + 5, auraMesh.position.z]}>{x ? 5000 : 1500}</Text><primitive object={auraMesh} /><primitive object={scene} /> </mesh>: null
}

export default ConstructionAsset