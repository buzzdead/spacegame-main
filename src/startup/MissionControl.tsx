import { useEffect, useState } from "react";
import useStore, { useShallowStore } from "../store/UseStore";
import UseSoundEffect from "../hooks/SoundEffect";
import { useThree, useFrame, useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { AudioLoader, Vector3 } from "three";
import { EffectComposer, ShockWave } from "@react-three/postprocessing";
import { SWave } from "../spaceobjects/ships/EnemyShip/swave";
import { useAsset } from "../hooks/Asset";
import { MemoizedPortalScene, PortalScene } from "./PortalSpawn";

type MissionState = {
  missionCompleted: boolean;
  blastShockWave: boolean;
  portals: boolean;
  hullShip: any;
};

export const MissionControl = () => {
  const { camera } = useThree();
  const {
    constructions,
    addShip,
    addCelestialObject,
    goToNextStage,
    findShip,
    missions,
  } = useShallowStore([
    "addShip",
    "goToNextStage",
    "constructions",
    "addCelestialObject",
    "setDestination",
    "findShip",
    "missions",
  ]);
  const [state, set] = useState<MissionState>({
    missionCompleted: false,
    blastShockWave: false,
    portals: false,
    hullShip: null,
  });

  useAsset("/assets/spaceships/mothershipp.glb", 1, true);
  useAsset("/assets/celestialobjects/sphere.glb", 1, true);
  useAsset("/assets/theworld3.glb", 1, true)
  const {
    sound: missionCompletedSound,
    calculateVolume: calculateMissionCompletedSound,
  } = UseSoundEffect({
    sfxPath: "/assets/sounds/scientist-discovery.mp3",
    minVolume: 4,
    position: new Vector3(400, 50, 750),
  });
  const {
    sound: invasionSound,
    calculateVolume: calculateInvasionSound,
  } = UseSoundEffect({
    sfxPath: "/assets/sounds/disturbance.mp3",
    minVolume: 4,
    position: new Vector3(400, 50, 750),
  });
  const handleTheTimeout = () => {
    set({ ...state, blastShockWave: true, portals: true });
    setTimeout(() => {
      set({ ...state, blastShockWave: false, portals: true }); invasionSound?.stop(); invasionSound?.play();
    }, 5000);
  };
  useEffect(() => {
    const mission = missions.find((m) => m.name === "mission1");
    if (mission?.currentStage === "stage2") {
      setTimeout(handleTheTimeout, 8000);
    }
  }, [missions]);
  useEffect(() => {
    const enemyConstructions = constructions.filter((c) => c.type === "Enemy");
    if (enemyConstructions.length === 0 && constructions.length !== 0)
      set({ ...state, missionCompleted: true });
  }, [constructions]);
  useEffect(() => {
    const hs = state.hullShip;
    if (!hs || hs?.meshRef?.position) return;
    const abc = findShip(hs.id);
    set({ ...state, hullShip: abc });
  }, [state.hullShip]);
  useEffect(() => {
    if (state.missionCompleted) {
      const theShip = addShip("hullspaceship", [0, 0, 100], 0.33);
      set({ ...state, hullShip: theShip });
      addCelestialObject("sphere", [250, 50, 750], 0.05);
      missionCompletedSound?.stop();
      missionCompletedSound?.play();
    }
  }, [state.missionCompleted]);
  useEffect(() => {
    const hs = state.hullShip;
    if (!hs?.meshRef?.position) return;
    calculateMissionCompletedSound(hs?.meshRef?.position || hs.position);
    calculateInvasionSound(hs?.meshRef?.position || hs.position)
  }, [camera.position, constructions, state.hullShip, missions]);

  return (
    <group>
      {state.blastShockWave && (
        <EffectComposer>
          <SWave pos={new Vector3(250, 50, 750)} />
        </EffectComposer>
      )}{" "}
      {state.portals && (
        <group>
          <MemoizedPortalScene position={new Vector3(850, 50, 1450)} />
          <MemoizedPortalScene position={new Vector3(-50, 50, 1450)} />
        </group>
      )}
    </group>
  );
};
