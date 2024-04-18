import React from "react";
import LoadObjects from "./loadobjects";
import UI from "./features/ui";
import ThreeSetup from "./components/ThreeSetup";

interface Props {
  startPlanet: "planet1" | "planet2" | "planet3" | "planet5" | "planet6";
  startShip: "hullspaceship" | "spaceship-evil" | "cargo";
}

const SpaceGame: React.FC<Props> = ({ startPlanet, startShip }) => {
  
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }}>
      <UI />
      <ThreeSetup>
      <LoadObjects startPlanet={startPlanet} startShip={startShip}/>
      </ThreeSetup>
    </div>
  );
};

export default SpaceGame;
