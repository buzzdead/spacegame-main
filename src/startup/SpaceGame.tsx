import React, { Suspense } from "react";
import UI from "../features/UI";
import ThreeSetup from "./ThreeSetup";
import { LoadCelestialObjects } from "./LoadCelestialObjects";
import { LoadConstructions } from "./LoadConstructions";
import { LoadShips } from "./LoadShips";
import { Starfield2 } from "./Starfield2";
import { Collisions } from "./OrbitControls";
import { Effects } from "./Effects";
import { LoadEnemyShips } from "./LoadEnemyShips";
import { KeyboardProvider } from "../hooks/Keys";
import { MissionControl } from "./MissionControl";
import { Vector3 } from "three";
import {PortalScene} from "./PortalSpawn";
import { Random } from "./random";

interface Props {
  startPlanet: "planet1" | "planet2" | "planet3" | "planet5" | "planet6";
  startShip: "hullspaceship" | "spaceship-evil" | "cargo";
}

const SpaceGame: React.FC<Props> = ({ startPlanet, startShip }) => {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <UI />
      <ThreeSetup>
        <KeyboardProvider>
        <Suspense fallback={null}>
          <group>
          <Collisions />
          <LoadCelestialObjects startPlanet={startPlanet} />
          <LoadConstructions />
          <LoadShips startShip={startShip} />
          <LoadEnemyShips />
          <Effects />
          <MissionControl />
          <PortalScene position={new Vector3(850, 50, 1450)} />
          <PortalScene position={new Vector3(-50, 50, 1450)} />
          <Random />
          </group>
        </Suspense>
        </KeyboardProvider>
      </ThreeSetup>
      
    </div>
  );
};

export default SpaceGame;
