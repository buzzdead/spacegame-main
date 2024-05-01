import { useFrame } from "@react-three/fiber";
import { useAsset } from "../../hooks/Asset";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useRef } from "react";
import { AssetPortal } from "./AssetPortal";

interface Props {
  shouldRender: boolean;
  glbPath: string;
  x?: number;
  scale?: number;
}

const ConstructionAsset = ({ shouldRender, glbPath, x, scale }: Props) => {
  const scene = useAsset(glbPath, scale || 8);
  const textRef = useRef<THREE.Mesh>(null);
  scene.position.y = 12;
  scene.position.z = -2;
  scene.position.x = x || 0;

  if (x) {
    scene.position.z += 15;
    scene.position.x += 7.5;
  }

  useFrame(() => {
    if (textRef.current && textRef.current.rotation) {
      textRef.current.rotation.set(0, scene.children[0].rotation.y - 1.55, 0);
    }
    scene.children[0].rotation.y += 0.01;
  });
 
  return shouldRender ? (
    <mesh>
      <Text
        ref={textRef}
        position={[
          scene.position.x,
          scene.position.y + 5,
          scene.position.z + (x ? -1 : 3),
        ]}
      >
        {x ? 5000 : 1500}
      </Text>
      <AssetPortal assetPosition={scene.position.clone()} x={x || 0} />
      <primitive object={scene} />
    </mesh>
  ) : null;
};

export default ConstructionAsset;
