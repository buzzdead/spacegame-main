import { Center, Plane, Text } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useRef, useState } from "react";
import { EnemyShip } from "../../store/StoreState";
import { Ship } from "../../store/SpaceGameStateUtils";

interface Props {
  position: Vector3;
  type: "Cruiser" | "Fighter" | "Cargo";
  hullRef?: any;
}

export const InfoBox = ({ position, hullRef, type }: Props) => {
  const [hullState, setHullState] = useState(hullRef?.current || 100);
  const { camera } = useThree();
  const ref = useRef<any>();
  const textRef = useRef<any>();

  useFrame(() => {
    if (hullRef && hullRef.current !== hullState) setHullState(hullRef.current);
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
      <Plane args={[10, 10]} position={[0, 5, 0]} receiveShadow>
        <meshStandardMaterial
          opacity={0.3}
          transparent
          color={"black"}
          attach={"material"}
        />
        <Text
          ref={textRef}
          font="./assets/LondrinaShadow-Regular.TTF"
          fontSize={1.25}
          position={[0, 3.5, 0]}
          lineHeight={2}
          color={"red"}
        >
          {type}
        </Text>
        <Text
          ref={textRef}
          font="./assets/LondrinaShadow-Regular.TTF"
          fontSize={1.25}
          position={[0, 0, 0]}
          lineHeight={2}
          color={"#42a8bd"}
        >
          {type} Ship{"\n"}
          Hull: {hullState}\{type === "Cruiser" ? 300 : 100}
        </Text>
      </Plane>
    </mesh>
  );
};
