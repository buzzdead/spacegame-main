import "../styles/theme.css";
import { Form, Input, Select, Button, Flex } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  RocketOutlined,
  SettingFilled,
  SecurityScanOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Checkmark from "./Checkmark";
import useStore, { useShallowStore } from "../store/UseStore";
import { createJWT, decodeJWT } from "../util";

interface Props {
  setGameStarted: (b: boolean) => void;
}

export const LoggedIn = ({ setGameStarted }: Props) => {
    const {logIn} = useShallowStore(["logIn"])

    const handleLogOut = () => {
        logIn({name: '', homebase: '', solarSystem: ''}, true)
        localStorage.removeItem("cookies")
    }
  return (
    <div style={{ gap: 20, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "row", position: 'relative' }}>
        <UserOutlined
          style={{
            color: "lightblue",
            marginRight: 8,
            position: 'absolute',
            left: -25,
            top: 7.5
          }}
        />
        <Input
          disabled
          style={{
            backgroundColor: "lightblue",
            color: "green",
            fontSize: 14,
            fontWeight: "bold",
          }}
          value={"asdf"}
          autoFocus
          placeholder="Player name"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "row", position: 'relative' }}>
        <HomeOutlined
          style={{
            color: "lightblue",
            marginRight: 8,
            position: 'absolute',
            left: -25,
            top: 7.5
          }}
        />
        <Input
          style={{
            backgroundColor: "lightblue",
            color: "green",
            fontSize: 14,
            fontWeight: "bold",
          }}
          value={"homebase name"}
          placeholder="Homebase name"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "row", position: 'relative' }}>
        <RocketOutlined
          style={{
            color: "lightblue",
            marginRight: 8,
            position: 'absolute',
            left: -25,
            top: 7.5
          }}
        />
        <Input
          style={{
            backgroundColor: "lightblue",
            color: "green",
            fontSize: 14,
            fontWeight: "bold",
          }}
          value={"soll"}
          placeholder="Solar system"
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 12.5, marginTop: 5 }}>
        {" "}
        <Button
          type={"primary"}
          onClick={handleLogOut}
          style={{ width: "105px", height: "40px" }}
        >
          Log out
        </Button>
        <Button
          type={"text"}
          onClick={() => setGameStarted(true)}
          style={{ width: "105px", height: "40px" }}
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};
