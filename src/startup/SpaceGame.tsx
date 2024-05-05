import React, { Suspense } from "react";
import UI from "../features/UI";
import ThreeSetup from "./ThreeSetup";
import { LoadCelestialObjects } from "./LoadCelestialObjects";
import { LoadConstructions } from "./LoadConstructions";
import { LoadShips } from "./LoadShips";
import { Starfield2 } from "./Starfield2";
import ShockWaveComponent from "../features/Shockwave";
import { Collisions } from "./OrbitControls";
import useStore from "../store/UseStore";
import { Effects } from "./Effects";
import { LoadEnemyShips } from "./LoadEnemyShips";
interface Props {
  startPlanet: "planet1" | "planet2" | "planet3" | "planet5" | "planet6";
  startShip: "hullspaceship" | "spaceship-evil" | "cargo";
}

const SpaceGame: React.FC<Props> = ({ startPlanet, startShip }) => {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <UI />
      <ThreeSetup>
        <Suspense fallback={<Starfield2 />}>
          <Collisions />
          <LoadCelestialObjects startPlanet={startPlanet} />
          <LoadConstructions />
          <LoadShips startShip={startShip} />
          <LoadEnemyShips />
          <Effects />
        </Suspense>
      </ThreeSetup>
    </div>
  );
};

export default SpaceGame;
