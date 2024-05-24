import React, { useEffect, useState } from "react";
import "./styles/theme.css";
import AudioPlayer from "./features/AudioPlayer";
import SpaceGame from "./startup/SpaceGame";
import Menu from "./features/Menu";
import { decodeJWT } from "./util";
import useStore from "./store/UseStore";
const gameMusic = require("./assets/sd2.mp3");

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const logIn = useStore(state => state.logIn)
  useEffect(() => {
    const abc = async () => {
      const token = localStorage.getItem("token")
      if(!token) return
      const res = await decodeJWT(token)
      if(res &&  (res?.exp || 0 > 0)) {
        const {homebase, name, solarSystem} = res
        logIn({homebase: res.homebase as string, name: res.name as string, solarSystem: res.solarSystem as string})
      }
    }
  abc()
  }, [])

  return (
    <div className="App">
      {gameStarted ? (
        <>
          <AudioPlayer src={gameMusic} autoPlay loop shouldPlay={gameStarted} />
          <SpaceGame startShip="cargo" startPlanet="planet1" />
        </>
      ) : (
        <Menu setGameStarted={setGameStarted} />
      )}
    </div>
  );
};

export default App;
