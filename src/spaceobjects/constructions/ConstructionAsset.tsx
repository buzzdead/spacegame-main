import { useFrame, useThree } from "@react-three/fiber";
import { useShallowStore } from "../../store/useStore";
import { useAsset } from "../useAsset";
import * as THREE from "three";
import { Center, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import { Ship } from "../../store/spaceGameStateUtils";
import { spaceShips } from "../../store/storeAssets";

interface Props {
  shouldRender: boolean;
  glbPath: string;
  x?: number;
  scale?: number;
}

const ConstructionAsset = ({ shouldRender, glbPath, x, scale }: Props) => {
  const { ships, addShip, setResources } = useShallowStore(["addShip", "ships", "setResources" ]);
  const { camera } = useThree();
  const scene = useAsset(glbPath, scale || 8);
  const textRef = useRef<THREE.Mesh>(null);
  const [clicked, setClicked] = useState(false)
  scene.position.y = 12;
  scene.position.z = -2;
  scene.position.x = x || 0;

  const auraGeometry = new THREE.SphereGeometry(3, 32, 32);
  const auraMaterial = new THREE.MeshPhongMaterial({
    color: "green",
    opacity: 0.0001,
    transparent: true,
    emissive: clicked ? "green" : "white", // Add this line to make the material glow
    emissiveIntensity: clicked ? 745 : 45.5, // Adjust this value to control the glow intensity
  });
  const auraMesh = new THREE.Mesh(auraGeometry, auraMaterial);
  auraMesh.position.copy(scene.position.clone());
  auraMesh.position.z += x ? 1 : 3;
  auraMesh.position.x += x ? 1.5 : 0;
  if(x){
  scene.position.z = 0
  scene.position.x += 1.5}
  auraMesh.scale.setScalar(1.2); // adjust the scale to fit your needs
  useFrame(() => {
    if (textRef.current && textRef.current.rotation) {
      textRef.current.rotation.set(0, scene.children[0].rotation.y - 1.55, 0);
    }
    scene.children[0].rotation.y += 0.01;
  });
  const handleOnClick = (e: any) => {
    e.stopPropagation();
    const a = setResources(x ? -5000 : -1500)
    if(!a) return
    setClicked(true)
    addShip(
      x ? "hawk" : "fighter",
      [3 + ships.length * 15, 0, 3],
      x ? 0.03 : 11
    );
    setTimeout(() => setClicked(false), 150)
  };
  return shouldRender ? (
    <mesh onClick={handleOnClick}>
      <Text
        ref={textRef}
        color={clicked ? 'green' : 'white'}
        position={[
          auraMesh.position.x,
          auraMesh.position.y + 5,
          auraMesh.position.z,
        ]}
      >
        {x ? 5000 : 1500}
      </Text>
      <primitive object={auraMesh} />
      <primitive object={scene} />{" "}
    </mesh>
  ) : null;
};

export default ConstructionAsset;
