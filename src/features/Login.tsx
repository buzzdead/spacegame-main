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
            <Input autoFocus placeholder="Player name" />
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
            <Input placeholder="Password" type="password" />
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