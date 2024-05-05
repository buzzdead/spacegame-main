import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { EffectComposer, wrapEffect } from "@react-three/postprocessing";
import { ShockWaveEffect } from "../postprocessing/ShockWaveEffect"; // Import your recreated effect
import { useShallowStore } from "../store/UseStore";

const SWave = wrapEffect(ShockWaveEffect);
let length = 0;
export const getLength = () => {
  return length;
};
export const ShockWaveComponent = () => {
  const { enemyShips } = useShallowStore(["enemyShips"]);
  const [positions, setPositions] = useState<Vector3[]>();
  const explodeRef = useRef(true);
  const ref = useRef<any>(null);

  useEffect(() => {
    const abc = enemyShips.filter((s) => s.nearby).map((s) => s.meshRef?.position || s.position);
    abc.length !== positions?.length && setPositions(abc);
    length = abc.length;
  }, [enemyShips]);

  useFrame(() => {
    if (explodeRef.current && ref.current) {
      ref.current.speed = length === 1 ? 2 : 1.25;
      ref.current.explode();
      explodeRef.current = false;
      setTimeout(() => (explodeRef.current = true), 1500);
    }
  });
  if (!positions || positions.length === 0) return null;
  return (
    <EffectComposer>
      <SWave position={positions} ref={ref} />
    </EffectComposer>
  );
};

export default ShockWaveComponent;
