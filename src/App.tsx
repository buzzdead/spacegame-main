import React, { useState } from "react";
import "./styles/theme.css";
import { Form, Input, Select, Button } from "antd";
import { UserOutlined, HomeOutlined, RocketOutlined } from "@ant-design/icons";
import Starfield from "./Starfield";
import AudioPlayer from "./AudioPlayer";
import SpaceGame from "./spacegame";
const menuMusic = require('./assets/menu-song.mp3')

interface PlayerInfo {
  username: string;
  homebase: string;
  solarSystem: string;
}

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false)
  const onFinish = (values: PlayerInfo) => {
    // Simulate starting the game (replace with your logic)
    setGameStarted(true)
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };



   return (
    <div className="App">
      <AudioPlayer src={menuMusic} autoPlay loop shouldPlay={!gameStarted}/> 
      {gameStarted ? <SpaceGame startShip="cargo" startPlanet="planet5"/> 
      : 
      <div>
      <Starfield />
      <div className="start-page-container">
        <h1 style={{ textAlign: "center", paddingBottom: 15 }} className="game-title">
          Space Game  
        </h1>{" "}
        {/* Change to your game title */}
        <Form
          name="player-creation"
          style={{gap: 20, display: 'flex', flexDirection: 'column'}}
          initialValues={{ username: "", homebase: "", solarSystem: "" }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            name="username"
          >
            <div style={{display: 'flex', flexDirection: 'row'}}><UserOutlined style={{color: 'lightblue', marginRight: 8, position: 'absolute', left: -25, top: 7.5 }} /><Input autoFocus placeholder="Player name" /></div>
          </Form.Item>
          <Form.Item
            name="homebase"
          >
            <div style={{display: 'flex', flexDirection: 'row'}}><HomeOutlined style={{color: 'lightblue', marginRight: 8, position: 'absolute', left: -25, top: 7.5  }} /><Input placeholder="Homebase name" /></div>
          </Form.Item>
          <Form.Item
            name="solarSystem"
          >
            <div style={{display: 'flex', flexDirection: 'row'}}>
            <RocketOutlined style={{color: 'lightblue', marginRight: 8, position: 'absolute', left: -25, top: 7.5   }} />
            <Select>
              <Select.Option value="sol">Sol (Our Solar System)</Select.Option>
              <Select.Option value="alphaCentauri">
                Alpha Centauri
              </Select.Option>
              <Select.Option value="kepler186f">Kepler-186f</Select.Option>
            </Select>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "250px" }}>
              Start Game
            </Button>
          </Form.Item>
        </Form>
      </div>
</div>
}
    </div>
  );
};

export default App;
