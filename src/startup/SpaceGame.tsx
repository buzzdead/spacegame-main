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
import { MemoizedPortalScene } from "./PortalSpawn";

interface Props {
  startPlanet: "planet1" | "planet2" | "planet3" | "planet5" | "planet6";
  startShip: "hullspaceship" | "spaceship-evil" | "cargo";
}

const SpaceGame: React.FC<Props> = ({ startPlanet }) => {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <UI />
      <KeyboardProvider>
      <ThreeSetup>
        <Suspense fallback={<Starfield2 />}>
          <Collisions />
          <LoadCelestialObjects startPlanet={startPlanet} />
          <LoadConstructions />
          <Effects />
          <MissionControl />
          <MemoizedPortalScene position={new Vector3(850, 50, 1450)} />
          <MemoizedPortalScene position={new Vector3(-50, 50, 1450)} />
        </Suspense>
      </ThreeSetup>
      </KeyboardProvider>
    </div>
  );
};

export default SpaceGame;
