import { Center, Plane, Text } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useRef, useState } from "react";
import { EnemyShip } from "../../store/StoreState";
import { Ship } from "../../store/SpaceGameStateUtils";

interface Props {
  position: Vector3;
  type: "Cruiser" | "Fighter" | "Cargo";
  meshRef?: any;
}

export const InfoBox = ({ position, meshRef, type }: Props) => {
  const [hullState, setHullState] = useState(meshRef?.current?.hull || 100);
  const { camera } = useThree();
  const ref = useRef<any>();
  const textRef = useRef<any>();

  useFrame(() => {
    if (meshRef && meshRef.current?.hull && meshRef.current?.hull !== hullState) setHullState(meshRef.current.hull);
    if (ref?.current?.rotation) {
      ref.current.rotation.set(
        camera.rotation.x,
        camera.rotation.y,
        camera.rotation.z
      );
    }
    const pos = position.clone();
    pos.y += 5;
    ref.current.position.set(pos.x, pos.y, pos.z);
  });

  return (
    <mesh ref={ref}>
      <Plane args={[10, 10]} position={[0, type === "Cruiser" ? 10 : 5, 0]} receiveShadow>
        <meshStandardMaterial
          opacity={0.01}
          transparent
          color={"black"}
          attach={"material"}
        />
        <Text
          ref={textRef}
          font="./assets/LondrinaShadow-Regular.TTF"
          fontSize={type === "Cruiser" ? 2.5 : 1.25}
          position={[0, type === "Cruiser" ? 6.5 : 3.5, 0]}
          lineHeight={2}
          color={"red"}
        >
          {type}
        </Text>
        <Text
          ref={textRef}
          font="./assets/LondrinaShadow-Regular.TTF"
          fontSize={type === "Cruiser" ? 2.5 : 1.25}
          position={[0, 0, 0]}
          lineHeight={2}
          color={"#42a8bd"}
        >
          {type} Ship{"\n"}
          Hull: {hullState}\{type === "Cruiser" ? 350 : 100}
        </Text>
      </Plane>
    </mesh>
  );
};
