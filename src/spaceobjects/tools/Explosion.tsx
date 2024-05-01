import { useMemo } from "react";
import { Vector3 } from "three";
import { Fire } from "./Fire";
import { Smoke } from "./Smoke";

interface Props {
  position: Vector3;
}

export const Explosion = ({ position }: Props) => {
  const pointsMultiplier = useMemo(() => {
    return (
      window.innerHeight / (2.0 * Math.tan((0.5 * 60.0 * Math.PI) / 180.0))
    );
  }, []);

  return (
    <group position={position}>
      <Fire pointsMultiplier={pointsMultiplier}/>
      <Smoke pointsMultiplier={pointsMultiplier}/>
    </group>
  );
};
// SrcColorFactor ConstantColorFactor
export default Explosion;
