import React, { Suspense } from "react";
import UI from "../features/UI";
import ThreeSetup from "./ThreeSetup";
import { LoadCelestialObjects } from "./LoadCelestialObjects";
import { LoadConstructions } from "./LoadConstructions";
import { Starfield2 } from "./Starfield2";
import { Collisions } from "./OrbitControls";
import { Effects } from "./Effects";
import { KeyboardProvider } from "../hooks/Keys";
import { MissionControl } from "./MissionControl";
import { Vector3 } from "three";
import {PortalScene} from "./PortalSpawn";
import useStore from "../store/UseStore";

interface Props {
  startPlanet: "planet1" | "planet2" | "planet3" | "planet5" | "planet6";
  startShip: "hullspaceship" | "spaceship-evil" | "cargo";
}

const SpaceGame: React.FC<Props> = ({ startPlanet }) => {
  const developerMode = useStore(state => state.developerMode)
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <UI />
      <KeyboardProvider>
      <ThreeSetup>
        <Suspense fallback={<Starfield2 />}>
          <group>
          <Collisions />
          <LoadCelestialObjects startPlanet={startPlanet} />
          <LoadConstructions />
          <Effects />
          <MissionControl />
          {developerMode && <group><PortalScene forceDev position={new Vector3(850, 50, 1450)} />
          <PortalScene forceDev position={new Vector3(-50, 50, 1450)} /></group>}
         
          </group>
        </Suspense>
     
      </ThreeSetup>
      </KeyboardProvider>
    </div>
  );
};

export default SpaceGame;
