import React, { Suspense } from "react";
import UI from "./features/ui";
import ThreeSetup from "./components/ThreeSetup";
import { LoadCelestialObjects } from "./loadcelestialobjects";
import { LoadConstructions } from "./loadConstructions";
import { LoadShips } from "./loadships";
import {Starfield2} from "./features/starfield2";
import { EnemyShip } from "./spaceobjects/ships/EnemyShip";

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
        <LoadCelestialObjects startPlanet={startPlanet} />
        <LoadConstructions />
        <LoadShips startShip={startShip} />
        <EnemyShip />
      </Suspense>
      </ThreeSetup>
    </div>
  );
};

export default SpaceGame;
