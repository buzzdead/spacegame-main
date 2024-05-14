import { useEffect } from "react";
import ShockWaveComponent from "../features/Shockwave";
import useStore from "../store/UseStore";
import UseSoundEffect from "../hooks/SoundEffect";
import { useThree } from "@react-three/fiber";
import { ExplosionEffects } from "./Effects/ExplosionEffect";

export const Effects = () => {
  const { scene, camera } = useThree();
  const postProcessing = useStore((state) => state.postProcessing);

  const { sound: narrative, calculateVolume: calculateNarrative } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/narrative.mp3",
      scene: scene,
      minVolume: 3,
      camera: camera,
    });
  useEffect(() => {
    narrative?.play();
  }, [narrative]);
  return (
    <group>
     {/*  {postProcessing && <ShockWaveComponent />} */}
      <ExplosionEffects />
    </group>
  );
};
