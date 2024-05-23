import "../styles/theme.css";
import { Tabs } from "antd";
import Starfield from "../startup/Starfield";
import AudioPlayer from "./AudioPlayer";
import { Suspense, useState } from "react";
import { Options } from "./Options";
import type { TabsProps } from 'antd';
import { Register } from "./Register";
import { Login } from "./Login";
import useStore from "../store/UseStore";
const menuMusic = require("../assets/coddy.mp3");

interface PlayerInfo {
  username: string;
  homebase: string;
  solarSystem: string;
}

interface Props {
  setGameStarted: (b: boolean) => void;
}

const Menu = ({ setGameStarted }: Props) => {
  const [showOptions, setShowOptions] = useState(false);

  const items: TabsProps['items'] = [
    {key: '1', label: 'Register', children: <Register setGameStarted={setGameStarted} setShowOptions={() => setShowOptions(true)}/>,},
    {key: '2', label: 'Login', children:  <Login setGameStarted={setGameStarted} setShowOptions={() => setShowOptions(true)}/>}

  ]
  const onChange = (key: string) => {
  };
  return (
    <Suspense fallback={<div style={{ fontSize: 100 }}>Loading</div>}>
     <Options visible={showOptions} onClose={() => setShowOptions(false)}/>
      <AudioPlayer src={menuMusic} autoPlay loop shouldPlay />
      <div>
        <Starfield />
        <div className="start-page-container">
        <h2 style={{justifyContent: 'center', display: 'flex', fontSize: 12}}>
            Alpha 1.0
          </h2>
          <h1
            style={{ textAlign: "center", paddingBottom: 15 }}
            className="game-title"
          >
            Space Game
          </h1>{" "}
          
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </div>
      <p style={{fontSize: 14, color: 'grey', position: 'absolute', bottom: 5, right: 15}}>Contact Me</p>
    </Suspense>
  );
};

export default Menu;
