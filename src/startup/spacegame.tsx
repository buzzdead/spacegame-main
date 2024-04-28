import React, { Suspense } from "react";
import UI from "../features/ui";
import { Vector3 } from "three"
import ThreeSetup from "../components/ThreeSetup";
import { LoadCelestialObjects } from "./loadcelestialobjects";
import { LoadConstructions } from "./loadConstructions";
import { LoadShips } from "./loadships";
import {Starfield2} from "../features/starfield2";
import { EnemyShipScene } from "../spaceobjects/ships/EnemyShip/EnemyShipScene";
import { EffectComposer } from "@react-three/postprocessing";
import ShockWaveComponent from "../spaceobjects/test/test";

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
        <ShockWaveComponent/>
      </Suspense>
      </ThreeSetup>
    </div>
  );
};

export default SpaceGame;
