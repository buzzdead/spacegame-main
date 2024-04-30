import "../styles/theme.css";
import { Form, Input, Select, Button, Flex, Modal, Checkbox } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  RocketOutlined,
  SettingFilled,
} from "@ant-design/icons";
import Starfield from "./Starfield";
import AudioPlayer from "../components/AudioPlayer";
import { Suspense, useState } from "react";
import { useShallowStore } from "../store/useStore";
import { Options } from "./options";
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

  const onFinish = (values: PlayerInfo) => {
    // Simulate starting the game (replace with your logic)
    setGameStarted(true);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Failed:", errorInfo);
  };
  const [showOptions, setShowOptions] = useState(false);


  return (
    <Suspense fallback={<div style={{ fontSize: 100 }}>Loading</div>}>
     <Options visible={showOptions} onClose={() => setShowOptions(false)}/>
      <AudioPlayer src={menuMusic} autoPlay loop shouldPlay />
      <div>
        <Starfield />
        <div className="start-page-container">
          <h1
            style={{ textAlign: "center", paddingBottom: 15 }}
            className="game-title"
          >
            Space Game
          </h1>{" "}
          <Form
            name="player-creation"
            style={{ gap: 20, display: "flex", flexDirection: "column" }}
            initialValues={{ username: "", homebase: "", solarSystem: "" }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item name="username">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <UserOutlined
                  style={{
                    color: "lightblue",
                    marginRight: 8,
                    position: "absolute",
                    left: -25,
                    top: 7.5,
                  }}
                />
                <Input autoFocus placeholder="Player name" />
              </div>
            </Form.Item>
            <Form.Item name="homebase">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <HomeOutlined
                  style={{
                    color: "lightblue",
                    marginRight: 8,
                    position: "absolute",
                    left: -25,
                    top: 7.5,
                  }}
                />
                <Input placeholder="Homebase name" />
              </div>
            </Form.Item>
            <Form.Item name="solarSystem">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <RocketOutlined
                  style={{
                    color: "lightblue",
                    marginRight: 8,
                    position: "absolute",
                    left: -25,
                    top: 7.5,
                  }}
                />
                <Select>
                  <Select.Option value="sol">
                    Sol (Our Solar System)
                  </Select.Option>
                  <Select.Option value="alphaCentauri">
                    Alpha Centauri
                  </Select.Option>
                  <Select.Option value="kepler186f">Kepler-186f</Select.Option>
                </Select>
              </div>
            </Form.Item>
            <Flex gap={10} dir="row">
              <Button
                type="default"
                onClick={() => setShowOptions(true)}
                style={{ width: "120px" }}
              >
                Options
                <SettingFilled
                  style={{
                    color: "lightblue",
                    marginRight: 8,
                    pointerEvents: "none",
                    position: "absolute",
                    left: -32.5,
                    top: 7.5,
                  }}
                />
              </Button>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "120px" }}
                >
                  Start Game
                </Button>
              </Form.Item>
            </Flex>
          </Form>
        </div>
      </div>
    </Suspense>
  );
};

export default Menu;
