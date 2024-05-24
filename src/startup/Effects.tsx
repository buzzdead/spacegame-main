import { useEffect } from "react";
import ShockWaveComponent from "../features/Shockwave";
import UseSoundEffect from "../hooks/SoundEffect";
import { useThree } from "@react-three/fiber";
import { ExplosionEffects } from "./Effects/ExplosionEffect";
import useStore from "../store/UseStore";

export const Effects = () => {
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  const { sound: narrative, calculateVolume: calculateNarrative } =
    UseSoundEffect({
      sfxPath: "/assets/sounds/narrative.mp3",
      minVolume: 3,
    });
  useEffect(() => {

    !isLoggedIn && narrative?.play();
  }, [narrative]);
  return (
    <group>
     {/*  {postProcessing && <ShockWaveComponent />} */}
      <ExplosionEffects />
    </group>
  );
};
