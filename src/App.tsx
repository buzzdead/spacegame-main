import React, { useEffect, useState } from "react";
import "./styles/theme.css";
import SpaceGame from "./startup/SpaceGame";
import Menu from "./features/Menu";
import { decodeJWT } from "./util";
import useStore from "./store/UseStore";


const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const logIn = useStore(state => state.logIn)
  useEffect(() => {
    const CheckForToken = async () => {
      const token = localStorage.getItem("token")
      if(!token) return
      const res = await decodeJWT(token)
      if(res &&  (res?.exp || 0 > 0)) {
        const {homebase, name, solarSystem} = res
        logIn({homebase: homebase as string, name: name as string, solarSystem: solarSystem as string})
      }
    }
  CheckForToken()
  }, [])

  return (
    <div className="App">
      {gameStarted ? (
           <SpaceGame startShip="cargo" startPlanet="planet1" />
      ) : (
        <Menu setGameStarted={setGameStarted} />
      )}
    </div>
  );
};

export default App;
