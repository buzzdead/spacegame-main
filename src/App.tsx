import React, { useState } from "react";
import "./styles/theme.css";
import AudioPlayer from "./components/AudioPlayer";
import SpaceGame from "./startup/spacegame";
import Menu from "./features/menu";
const gameMusic = require("./assets/sd.mp3");

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="App">
      {gameStarted ? (
        <>
          <AudioPlayer src={gameMusic} autoPlay loop shouldPlay={gameStarted} />
          <SpaceGame startShip="cargo" startPlanet="planet5" />
        </>
      ) : (
        <Menu setGameStarted={setGameStarted} />
      )}
    </div>
  );
};

export default App;
