import { useEffect } from "react";
import ShockWaveComponent from "../features/Shockwave";
import useStore from "../store/UseStore";
import BeamWeapon from "../spaceobjects/tools/test/test123";

export const Effects = () => {
  const postProcessing = useStore((state) => state.postProcessing);
  const explosions = useStore((state) => state.explosions)
  return <group>
    {postProcessing && <ShockWaveComponent />}
    {explosions.map((e, id) => <BeamWeapon key={id} position={e}/>)}
    </group>;
};
