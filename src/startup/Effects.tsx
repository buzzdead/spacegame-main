import { useEffect } from "react";
import ShockWaveComponent from "../features/Shockwave";
import useStore from "../store/UseStore";
import { TextureLoader } from 'three'
import BeamWeapon from "../spaceobjects/tools/test/test123";
import UseSoundEffect from "../hooks/SoundEffect";
import { useThree } from "@react-three/fiber";

export const Effects = () => {
  const {scene, camera} = useThree()
  const postProcessing = useStore((state) => state.postProcessing);
  const explosions = useStore((state) => state.explosions)
  const particle = require('./explosion00.png')
  const { sound: narrative, calculateVolume: calculateNarrative } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/narrative.mp3",
      scene: scene,
      minVolume: 5,
      camera: camera,
    });
    useEffect(() => {
      narrative?.play()
    }, [narrative])
  const texture = new TextureLoader().load(particle);
  return <group>
    {postProcessing && <ShockWaveComponent />}
    {explosions.map((e, id) => <BeamWeapon texture={texture} key={id} position={e}/>)}
    </group>;
};
