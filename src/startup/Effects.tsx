import { useEffect } from "react";
import ShockWaveComponent from "../features/Shockwave";
import useStore from "../store/UseStore";
import { TextureLoader } from 'three'
import BeamWeapon from "../spaceobjects/tools/test/test123";

export const Effects = () => {
  const postProcessing = useStore((state) => state.postProcessing);
  const explosions = useStore((state) => state.explosions)
  const particle = require('./fire1.png')
  const texture = new TextureLoader().load(particle);
  return <group>
    {postProcessing && <ShockWaveComponent />}
    {explosions.map((e, id) => <BeamWeapon texture={texture} key={id} position={e}/>)}
    </group>;
};
