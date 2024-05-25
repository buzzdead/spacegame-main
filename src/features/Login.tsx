import "../styles/theme.css";
import { Form, Input, Select, Button, Flex } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  RocketOutlined,
  SettingFilled,
  SecurityScanOutlined
} from "@ant-design/icons";
import { useState } from "react";
import Checkmark from "./Checkmark";
import useStore from "../store/UseStore";
import { createJWT, decodeJWT } from "../util";

interface PlayerInfo {
    username: string;
    password: string
  }

  interface Props {
    setGameStarted: (b: boolean) => void;
    setShowOptions: () => void
  }

export const Login = ({setGameStarted, setShowOptions}: Props) => {
    const [failed, setFailed] = useState(false)
    const logIn = useStore((state) => state.logIn)
    const [registering, setRegistering] = useState(false)
    const onFinish = async (values: PlayerInfo) => {
      setRegistering(true)
        try {
          const response = await fetch('/.netlify/functions/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: values.username,
              password: values.password,
            }),
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
      
          const data = await response.json();

          logIn({name: values.username, homebase: "loggedin", solarSystem: "reallyLoggedIn"})
          const prevToken = localStorage.getItem("token")
          let shouldSetToken = false
          if(prevToken) {
            const res = await decodeJWT(prevToken)
            if(!res) shouldSetToken = true
            if(res?.exp && res?.exp <= 0) shouldSetToken = true
          }
          else {
            shouldSetToken = true
          }
          if(shouldSetToken){
            const b = data.player
          const token = await createJWT({ name: b.name, solarSystem: b.solarSystem, homebase: b.homebase });
          localStorage.setItem('token', token);}
          setGameStarted(true);
        } catch (error) {
          console.error('Failed to login:', error);
          onFinishFailed(error);
          if(failed) setGameStarted(true)
            else {setFailed(true); setTimeout(() => setRegistering(false), 10000)}
        }
      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.error("Failed:", errorInfo);
      };
    return (
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
            <Input name="username" autoComplete="current-username" autoFocus placeholder="Player name" />
          </div>
        </Form.Item>
        <Form.Item name="password">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <SecurityScanOutlined
              style={{
                color: "lightblue",
                marginRight: 8,
                position: "absolute",
                left: -25,
                top: 7.5,
              }}
            />
            <Input.Password name="password" autoComplete="" placeholder="Password" type="password" />
          </div>
        </Form.Item>
        
        <Flex gap={10} dir="row">
          <Button
            type="default"
            onClick={setShowOptions}
            style={{ width: "120px", height: '40px' }}
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
              type={failed ? "text" : "primary"}
              htmlType="submit"
              style={{ width: "120px", height: '40px' }}
            >
              {<div>{registering ? <div style={{position: 'relative', left: '25px', bottom: '2.5px'}}><Checkmark shouldComplete={failed} /></div> : "Start Game"} </div>}
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    )
}